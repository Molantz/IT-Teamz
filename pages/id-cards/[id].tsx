import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import QRCode from 'qrcode.react';
import Barcode from 'react-barcode';

export default function IdCardView() {
  const router = useRouter();
  const { id } = router.query;
  const [card, setCard] = useState<any>(null);

  useEffect(() => {
    if (id) fetch(`/api/id-cards?employeeId=${id}`).then(r => r.json()).then(data => setCard(data[0]));
  }, [id]);

  if (!card) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', border: '2px solid #333', borderRadius: 12, padding: 24, background: '#fff' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 8 }}>{card.company}</h2>
      <div style={{ textAlign: 'center', fontSize: 12, marginBottom: 16 }}>{card.company_address || ''}</div>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 16 }}>
        {card.image_url && <img src={card.image_url} alt="Employee" style={{ width: 80, height: 80, borderRadius: 8, objectFit: 'cover', border: '1px solid #ccc' }} />}
        <div>
          <div><b>Name:</b> {card.employee_name}</div>
          <div><b>Job Title:</b> {card.position}</div>
          <div><b>Department:</b> {card.department}</div>
          <div><b>Hired Date:</b> {card.hired_at}</div>
          <div><b>Card Number:</b> {card.card_number}</div>
          <div><b>Status:</b> {card.status}</div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <div><b>Issue Date:</b> {card.issue_date}</div>
          <div><b>Expiry Date:</b> {card.expiry_date ? card.expiry_date : 'No Expiry'}</div>
        </div>
        <QRCode value={JSON.stringify({ id: card.id, employee: card.employee_name, card: card.card_number })} size={80} />
      </div>
      <div style={{ textAlign: 'center', marginBottom: 8 }}>
        <Barcode value={card.card_number} width={1.5} height={40} fontSize={12} />
      </div>
      {card.signature_url && <div style={{ textAlign: 'right' }}><img src={card.signature_url} alt="Signature" style={{ width: 100, height: 40, objectFit: 'contain' }} /></div>}
      <div style={{ textAlign: 'center', marginTop: 16 }}>
        <button onClick={() => window.print()}>Print Card</button>
      </div>
    </div>
  );
} 