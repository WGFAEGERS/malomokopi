type ReceiptItem = {
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
};

type ReceiptData = {
  orderNumber: string;
  items: ReceiptItem[];
  total: number;
  date: Date;
};

function formatCents(cents: number): string {
  return (cents / 100).toFixed(2);
}

export function printReceipt(data: ReceiptData) {
  const itemRows = data.items
    .map(
      (item) => `
      <tr>
        <td style="padding:4px 0;text-align:left;">${item.quantity}x ${item.name}</td>
        <td style="padding:4px 0;text-align:right;">$${formatCents(item.subtotal)}</td>
      </tr>`
    )
    .join("");

  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Receipt - ${data.orderNumber}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Courier New', monospace;
      width: 300px;
      margin: 0 auto;
      padding: 20px 10px;
      color: #000;
    }
    .header { text-align: center; margin-bottom: 16px; }
    .header h1 { font-size: 20px; font-weight: bold; letter-spacing: 1px; }
    .header p { font-size: 11px; color: #555; margin-top: 4px; }
    .divider {
      border: none;
      border-top: 1px dashed #999;
      margin: 12px 0;
    }
    .order-info { font-size: 12px; margin-bottom: 4px; }
    .order-info span { font-weight: bold; }
    table { width: 100%; font-size: 13px; border-collapse: collapse; }
    .total-row td {
      padding-top: 10px;
      font-size: 16px;
      font-weight: bold;
      border-top: 1px dashed #999;
    }
    .footer {
      text-align: center;
      margin-top: 20px;
      font-size: 11px;
      color: #555;
    }
    @media print {
      body { width: 100%; padding: 0; }
      @page { margin: 10mm; size: 80mm auto; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>CAFE POS</h1>
    <p>Thank you for your order!</p>
  </div>

  <hr class="divider" />

  <div class="order-info">Order: <span>${data.orderNumber}</span></div>
  <div class="order-info">Date: <span>${new Date(data.date).toLocaleString()}</span></div>

  <hr class="divider" />

  <table>
    <tbody>
      ${itemRows}
      <tr class="total-row">
        <td style="text-align:left;">TOTAL</td>
        <td style="text-align:right;">$${formatCents(data.total)}</td>
      </tr>
    </tbody>
  </table>

  <hr class="divider" />

  <div class="footer">
    <p>Thank you for visiting!</p>
    <p>Please come again</p>
  </div>
</body>
</html>`;

  const printWindow = window.open("", "_blank", "width=350,height=600");
  if (!printWindow) return;

  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();

  // Wait for content to render, then print
  printWindow.onload = () => {
    printWindow.print();
  };
  // Fallback if onload doesn't fire
  setTimeout(() => {
    printWindow.print();
  }, 300);
}
