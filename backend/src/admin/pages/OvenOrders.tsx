import * as React from 'react';
import { useFetchClient } from '@strapi/strapi/admin';

type Status = 'processing' | 'ready' | 'collected' | 'cancelled';
type Media = { url: string } | null;
type Order = {
  documentId: string;
  customerName: string;
  phone: string | null;
  phoneMasked: string;
  startedAt: string;
  estimatedReadyAt: string;
  status: Status;
  serverTime: string;
  beforeImage: Media;
  afterImage: Media;
};

const statusText: Record<Status, string> = {
  processing: '制作中',
  ready: '可以取啦',
  collected: '已领取',
  cancelled: '已取消',
};

const ordersEndpoint = '/admin/oven-orders';
const uploadTargetBytes = 4 * 1024 * 1024;
const uploadMaxEdge = 2000;
const acceptedPhotoTypes = ['image/jpeg', 'image/png', 'image/webp'];

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: '100%', background: '#f6f6f9', padding: '32px' },
  wrap: { maxWidth: 1280, margin: '0 auto' },
  heading: { fontSize: 32, margin: 0, color: '#32324d' },
  intro: { color: '#666687', marginTop: 8, lineHeight: 1.7 },
  panel: { background: '#fff', border: '1px solid #eaeaef', borderRadius: 12, padding: 24, marginTop: 24, boxShadow: '0 1px 4px rgba(33,33,52,.06)' },
  form: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 16, alignItems: 'end' },
  label: { display: 'grid', gap: 8, color: '#32324d', fontWeight: 600 },
  input: { minHeight: 44, border: '1px solid #dcdce4', borderRadius: 8, padding: '0 12px', fontSize: 15 },
  primary: { minHeight: 44, border: 0, borderRadius: 8, padding: '0 20px', background: '#d4512f', color: '#fff', fontWeight: 700, cursor: 'pointer' },
  secondary: { minHeight: 36, border: '1px solid #dcdce4', borderRadius: 8, padding: '0 12px', background: '#fff', color: '#32324d', fontWeight: 600, cursor: 'pointer' },
  grid: { display: 'grid', gap: 16, marginTop: 20 },
  card: { background: '#fff', border: '1px solid #eaeaef', borderRadius: 12, padding: 20, display: 'grid', gap: 16 },
  row: { display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' },
  progressTrack: { height: 12, borderRadius: 999, overflow: 'hidden', background: '#ece7df', flex: '1 1 260px' },
  meta: { color: '#666687', fontSize: 13 },
  badge: { display: 'inline-flex', padding: '6px 10px', borderRadius: 999, background: '#f2e4d6', color: '#8c321b', fontWeight: 700, fontSize: 13 },
  photos: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 12 },
  photoBox: { border: '1px dashed #c9c9d2', borderRadius: 10, padding: 12, display: 'grid', gap: 10 },
};

function apiError(error: any) {
  const message = String(error?.response?.data?.error?.message || error?.message || '操作失败，请稍后重试。');
  if (/Unexpected token|valid JSON|Method Not Allowed/i.test(message)) {
    return '后台接口暂时不可用，请刷新页面后重试。';
  }
  return message;
}

function imageUrl(media: Media) {
  if (!media?.url) return '';
  return /^https?:/.test(media.url) ? media.url : `${window.location.origin}${media.url}`;
}

async function prepareOvenPhoto(file: File): Promise<File> {
  if (!acceptedPhotoTypes.includes(file.type)) throw new Error('仅支持 JPG、PNG 或 WebP 图片。');
  if (file.size <= uploadTargetBytes) return file;

  const bitmap = await createImageBitmap(file);
  try {
    let scale = Math.min(1, uploadMaxEdge / Math.max(bitmap.width, bitmap.height));
    for (let resizePass = 0; resizePass < 4; resizePass += 1) {
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(bitmap.width * scale));
      canvas.height = Math.max(1, Math.round(bitmap.height * scale));
      const context = canvas.getContext('2d');
      if (!context) throw new Error('浏览器暂时无法处理这张照片。');
      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

      for (const quality of [0.88, 0.78, 0.68, 0.58]) {
        const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/jpeg', quality));
        if (blob && blob.size <= uploadTargetBytes) {
          const basename = file.name.replace(/\.[^.]+$/, '') || 'oven-photo';
          return new File([blob], `${basename}.jpg`, { type: 'image/jpeg', lastModified: Date.now() });
        }
      }
      scale *= 0.78;
    }
  } finally {
    bitmap.close();
  }
  throw new Error('照片压缩后仍然过大，请换一张照片后重试。');
}

function progress(order: Order, now: number) {
  if (order.status === 'ready' || order.status === 'collected') return 100;
  if (order.status === 'cancelled') return 0;
  const start = new Date(order.startedAt).getTime();
  const end = new Date(order.estimatedReadyAt).getTime();
  return Math.max(0, Math.min(100, ((now - start) / Math.max(1, end - start)) * 100));
}

function remaining(order: Order, now: number) {
  if (order.status === 'ready') return '可以取啦';
  if (order.status === 'collected') return '已领取';
  if (order.status === 'cancelled') return '已取消';
  const milliseconds = Math.max(0, new Date(order.estimatedReadyAt).getTime() - now);
  const minutes = Math.ceil(milliseconds / 60000);
  return minutes > 1 ? `约 ${minutes} 分钟` : '不到 1 分钟';
}

function OrderCard({ order, now, onUpdate }: { order: Order; now: number; onUpdate: (order: Order) => void }) {
  const { put, post } = useFetchClient();
  const [busy, setBusy] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [showPhone, setShowPhone] = React.useState(false);
  const [before, setBefore] = React.useState<File | null>(null);
  const [after, setAfter] = React.useState<File | null>(null);

  async function update(payload: Record<string, unknown>) {
    setBusy(true); setMessage('');
    try {
      const response = await put(`${ordersEndpoint}/${order.documentId}`, payload);
      onUpdate(response.data.data);
    } catch (error) { setMessage(apiError(error)); }
    finally { setBusy(false); }
  }

  async function upload() {
    if (!before && !after) return;
    setBusy(true); setMessage('');
    try {
      setMessage('正在压缩并上传照片…');
      const body = new FormData();
      if (before) body.append('beforeImage', await prepareOvenPhoto(before));
      if (after) body.append('afterImage', await prepareOvenPhoto(after));
      const response = await post(`${ordersEndpoint}/${order.documentId}/images`, body);
      onUpdate(response.data.data); setBefore(null); setAfter(null); setMessage('照片已保存。');
    } catch (error) { setMessage(apiError(error)); }
    finally { setBusy(false); }
  }

  const percent = progress(order, now);
  return <article style={styles.card}>
    <div style={{ ...styles.row, justifyContent: 'space-between' }}>
      <div style={styles.row}>
        <strong style={{ fontSize: 22, color: '#32324d' }}>{order.customerName}</strong>
        <span style={styles.badge}>{statusText[order.status]}</span>
      </div>
      <button style={styles.secondary} type="button" onClick={() => setShowPhone(value => !value)}>
        {showPhone && order.phone ? order.phone : order.phoneMasked}
      </button>
    </div>
    <div style={styles.row}>
      <div style={styles.progressTrack} aria-label={`${order.customerName}制作进度 ${Math.round(percent)}%`}>
        <div style={{ height: '100%', width: `${percent}%`, borderRadius: 999, background: order.status === 'ready' ? '#328048' : '#d4512f', transition: 'width .5s ease' }} />
      </div>
      <strong style={{ minWidth: 100, color: '#32324d' }}>{remaining(order, now)}</strong>
      <span style={styles.meta}>预计 {new Date(order.estimatedReadyAt).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}</span>
    </div>
    <div style={styles.row}>
      {order.status !== 'collected' && order.status !== 'cancelled' && <>
        <button style={styles.secondary} disabled={busy} onClick={() => update({ adjustMinutes: -10 })}>提前10分钟</button>
        <button style={styles.secondary} disabled={busy} onClick={() => update({ adjustMinutes: 10 })}>延后10分钟</button>
        <button style={styles.secondary} disabled={busy} onClick={() => update({ status: 'ready' })}>立即可取</button>
        <button style={styles.secondary} disabled={busy} onClick={() => update({ status: 'collected' })}>标记已领取</button>
        <button style={styles.secondary} disabled={busy} onClick={() => update({ status: 'cancelled' })}>取消</button>
      </>}
    </div>
    <div style={styles.photos}>
      <label style={styles.photoBox}>
        <b>入炉前照片</b>
        {order.beforeImage && <img src={imageUrl(order.beforeImage)} alt="入炉前" style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 8 }} />}
        <input type="file" accept="image/jpeg,image/png,image/webp" onChange={event => setBefore(event.target.files?.[0] || null)} />
      </label>
      <label style={styles.photoBox}>
        <b>出炉后照片</b>
        {order.afterImage && <img src={imageUrl(order.afterImage)} alt="出炉后" style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 8 }} />}
        <input type="file" accept="image/jpeg,image/png,image/webp" onChange={event => setAfter(event.target.files?.[0] || null)} />
      </label>
    </div>
    {(before || after) && <button style={{ ...styles.primary, justifySelf: 'start' }} disabled={busy} onClick={upload}>{busy ? '保存中…' : '保存照片'}</button>}
    {message && <p role="status" style={{ margin: 0, color: message === '照片已保存。' ? '#328048' : '#b42318' }}>{message}</p>}
  </article>;
}

export default function OvenOrders() {
  const { get, post } = useFetchClient();
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [now, setNow] = React.useState(Date.now());
  const [name, setName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [before, setBefore] = React.useState<File | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState('');
  const serverOffset = React.useRef(0);

  function calibrate(order?: Order) {
    if (!order?.serverTime) return;
    serverOffset.current = new Date(order.serverTime).getTime() - Date.now();
    setNow(Date.now() + serverOffset.current);
  }

  const load = React.useCallback(async () => {
    try {
      const response = await get(ordersEndpoint);
      setOrders(response.data.data);
      if (response.data.data[0]?.serverTime) {
        serverOffset.current = new Date(response.data.data[0].serverTime).getTime() - Date.now();
        setNow(Date.now() + serverOffset.current);
      }
    }
    catch (requestError) { setError(apiError(requestError)); }
  }, [get]);

  React.useEffect(() => {
    load();
    const clock = window.setInterval(() => setNow(Date.now() + serverOffset.current), 1000);
    const refresh = window.setInterval(load, 15000);
    return () => { window.clearInterval(clock); window.clearInterval(refresh); };
  }, [load]);

  async function create(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setError('');
    const body = new FormData(); body.append('customerName', name); body.append('phone', phone);
    try {
      if (before) body.append('beforeImage', await prepareOvenPhoto(before));
      const response = await post(ordersEndpoint, body);
      calibrate(response.data.data);
      setOrders(current => [response.data.data, ...current]); setName(''); setPhone(''); setBefore(null);
    } catch (requestError) { setError(apiError(requestError)); }
    finally { setBusy(false); }
  }

  function replace(updated: Order) {
    calibrate(updated);
    setOrders(current => current.map(order => order.documentId === updated.documentId ? updated : order));
  }

  return <main style={styles.page}>
    <div style={styles.wrap}>
      <h1 style={styles.heading}>出炉进度</h1>
      <p style={styles.intro}>登记顾客后立即开始90分钟倒计时。顾客使用手机后四位查询；进行中的记录不能使用相同尾号，避免查错他人的面包。</p>
      <section style={styles.panel}>
        <h2 style={{ marginTop: 0, color: '#32324d' }}>登记新的面包</h2>
        <form style={styles.form} onSubmit={create}>
          <label style={styles.label}>顾客姓名<input style={styles.input} value={name} maxLength={30} required onChange={event => setName(event.target.value)} /></label>
          <label style={styles.label}>联系电话<input style={styles.input} value={phone} inputMode="tel" required onChange={event => setPhone(event.target.value)} /></label>
          <label style={styles.label}>入炉前照片（可选）<input type="file" accept="image/jpeg,image/png,image/webp" onChange={event => setBefore(event.target.files?.[0] || null)} /><small style={styles.meta}>超过4MB会在浏览器中自动压缩后上传</small></label>
          <button style={styles.primary} disabled={busy} type="submit">{busy ? '登记中…' : '登记并开始90分钟'}</button>
        </form>
        {error && <p role="alert" style={{ color: '#b42318', marginBottom: 0 }}>{error}</p>}
      </section>
      <section style={styles.panel}>
        <div style={{ ...styles.row, justifyContent: 'space-between' }}><h2 style={{ margin: 0, color: '#32324d' }}>顾客进度</h2><button style={styles.secondary} onClick={load}>刷新</button></div>
        <div style={styles.grid}>
          {orders.map(order => <OrderCard key={order.documentId} order={order} now={now} onUpdate={replace} />)}
          {!orders.length && <p style={styles.intro}>暂时没有进度记录。</p>}
        </div>
      </section>
    </div>
  </main>;
}
