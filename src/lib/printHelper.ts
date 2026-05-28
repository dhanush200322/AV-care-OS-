import { Invoice } from '../store/useStore';

/**
 * High-fidelity print document compile utility.
 * Generates custom, pristine light-themed layouts optimized for paper or PDF printing.
 */

export const printInvoice = (invoice: Invoice, t: (k: string) => string) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const subtotal = invoice.amount;
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  printWindow.document.write(`
    <html>
      <head>
        <title>${t('Invoice')} - ${invoice.id}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
          body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            color: #0f172a;
            background-color: #ffffff;
            padding: 40px;
            margin: 0;
            line-height: 1.5;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 2px solid #f1f5f9;
            padding-bottom: 24px;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 22px;
            font-weight: 800;
            letter-spacing: -0.05em;
            color: #7c3aed;
          }
          .logo span {
            color: #06b6d4;
          }
          .title {
            font-size: 24px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            margin: 0;
            color: #1e1b4b;
          }
          .meta-info {
            text-align: right;
          }
          .meta-ref {
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #64748b;
          }
          .meta-date {
            font-size: 13px;
            font-weight: 600;
            color: #0f172a;
            margin-top: 4px;
          }
          .details-grid {
            display: grid;
            grid-template-cols: 1fr 1fr;
            gap: 40px;
            margin-bottom: 40px;
          }
          .details-label {
            font-size: 10px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: #94a3b8;
            margin-bottom: 6px;
          }
          .details-value {
            font-size: 14px;
            font-weight: 700;
            color: #1e293b;
          }
          .table-title {
            font-size: 12px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #64748b;
            margin-bottom: 12px;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 8px;
          }
          .item-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px;
            background-color: #f8fafc;
            border: 1px solid #f1f5f9;
            border-radius: 12px;
            margin-bottom: 10px;
          }
          .item-name {
            font-size: 13px;
            font-weight: 700;
            color: #334155;
          }
          .item-price {
            font-size: 13px;
            font-weight: 800;
            color: #0f172a;
          }
          .totals-section {
            margin-top: 30px;
            border-top: 2px solid #f1f5f9;
            padding-top: 20px;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            width: 300px;
            padding: 4px 0;
            font-size: 12px;
            font-weight: 600;
            color: #64748b;
          }
          .total-row.grand {
            border-top: 1px solid #e2e8f0;
            margin-top: 12px;
            padding-top: 12px;
            font-size: 16px;
            font-weight: 800;
            color: #7c3aed;
          }
          .footer {
            margin-top: 60px;
            border-top: 1px dashed #cbd5e1;
            padding-top: 20px;
            text-align: center;
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: #94a3b8;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="logo">AV CARE<span>OS</span></div>
            <div class="title">${t('Invoice Details')}</div>
          </div>
          <div class="meta-info">
            <div class="meta-ref">${t('Ref')}: ${invoice.id}</div>
            <div class="meta-date">${t('Date')}: ${invoice.date}</div>
          </div>
        </div>

        <div class="details-grid">
          <div>
            <div class="details-label">${t('Patient Details')}</div>
            <div class="details-value">${t(invoice.patient)}</div>
          </div>
          <div>
            <div class="details-label">${t('Payment Protocol')}</div>
            <div class="details-value">${t('Self Pay')}</div>
          </div>
        </div>

        <div>
          <div class="table-title">${t('Services Rendered')}</div>
          ${invoice.services.map(s => `
            <div class="item-row">
              <span class="item-name">${t(s.name)}</span>
              <span class="item-price">₹${s.price.toLocaleString()}</span>
            </div>
          `).join('')}
        </div>

        <div class="totals-section">
          <div class="total-row">
            <span>${t('Subtotal')}</span>
            <span>₹${subtotal.toLocaleString()}</span>
          </div>
          <div class="total-row">
            <span>${t('Tax (GST 18%)')}</span>
            <span>₹${tax.toLocaleString()}</span>
          </div>
          <div class="total-row grand">
            <span>${t('Total Amount')}</span>
            <span>₹${total.toLocaleString()}</span>
          </div>
        </div>

        <div class="footer">
          AV CARE INTELLECTUAL OPERATING SYSTEM • SECURE BILLING GATEWAY TRANSACTION
        </div>
        <script>
          window.onload = function() {
            window.print();
            window.close();
          }
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
};

export const printBirthdayList = (people: any[], hospitalName: string, t: (k: string) => string) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  printWindow.document.write(`
    <html>
      <head>
        <title>${hospitalName} - Birthday List</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
          body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            color: #0f172a;
            background-color: #ffffff;
            padding: 40px;
            margin: 0;
            line-height: 1.5;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            border-bottom: 2px solid #f1f5f9;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .hospital-title {
            font-size: 18px;
            font-weight: 800;
            color: #1e1b4b;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin: 0;
          }
          .sheet-title {
            font-size: 11px;
            font-weight: 700;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            margin-top: 4px;
          }
          .date-stamp {
            font-size: 10px;
            font-weight: 800;
            color: #94a3b8;
            text-transform: uppercase;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th {
            border-bottom: 2px solid #e2e8f0;
            padding: 12px 8px;
            text-align: left;
            font-size: 9px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: #475569;
            background-color: #f8fafc;
          }
          td {
            border-bottom: 1px solid #f1f5f9;
            padding: 12px 8px;
            font-size: 12px;
            color: #334155;
          }
          tr:hover td {
            background-color: #f8fafc;
          }
          .bold {
            font-weight: 700;
            color: #0f172a;
          }
          .badge {
            display: inline-block;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 8px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            background-color: #f1f5f9;
            color: #475569;
          }
          .footer {
            margin-top: 50px;
            border-top: 1px dashed #e2e8f0;
            padding-top: 16px;
            text-align: center;
            font-size: 9px;
            font-weight: 700;
            color: #94a3b8;
            text-transform: uppercase;
            letter-spacing: 0.1em;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1 class="hospital-title">${hospitalName}</h1>
            <div class="sheet-title">Clinical Birthdays & Auto Greets Register List</div>
          </div>
          <div class="date-stamp">
            DATE: ${new Date().toLocaleDateString('en-US')}
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Recipient Name</th>
              <th>Category</th>
              <th>Clinical Role</th>
              <th>Age</th>
              <th>Birthdate</th>
              <th>Contact Primary</th>
            </tr>
          </thead>
          <tbody>
            ${people.map((p, idx) => `
              <tr>
                <td class="bold">BP-${String(idx + 1).padStart(3, '0')}</td>
                <td class="bold">${p.name}</td>
                <td><span class="badge">${p.category}</span></td>
                <td>${p.role}</td>
                <td>${p.age} yrs</td>
                <td style="font-family: monospace;">${p.birthdayDate}</td>
                <td style="font-family: monospace;">${p.phone}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="footer">
          CONFIDENTIAL PATIENT & STAFF DIRECTORY OVERVIEW • REGISTER RECORD STAMPED SECURE
        </div>
        <script>
          window.onload = function() {
            window.print();
            window.close();
          }
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
};

export const printReportsLedger = (timeline: string, stats: any, t: (k: string) => string) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  printWindow.document.write(`
    <html>
      <head>
        <title>AV CARE OS - Telemetry Analytics Sheet</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
          body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            color: #0f172a;
            background-color: #ffffff;
            padding: 40px;
            margin: 0;
            line-height: 1.5;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            border-bottom: 2px solid #7c3aed;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 20px;
            font-weight: 800;
            letter-spacing: -0.05em;
            color: #7c3aed;
          }
          .logo span {
            color: #06b6d4;
          }
          .sheet-title {
            font-size: 11px;
            font-weight: 700;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            margin-top: 4px;
          }
          .date-stamp {
            font-size: 10px;
            font-weight: 800;
            color: #94a3b8;
            text-transform: uppercase;
            text-align: right;
          }
          .stats-grid {
            display: grid;
            grid-template-cols: repeat(4, 1fr);
            gap: 20px;
            margin-bottom: 40px;
          }
          .stat-card {
            border: 1px solid #e2e8f0;
            border-radius: 16px;
            padding: 20px;
            background-color: #f8fafc;
          }
          .stat-label {
            font-size: 9px;
            font-weight: 800;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          .stat-val {
            font-size: 20px;
            font-weight: 800;
            color: #0f172a;
            margin-top: 8px;
          }
          .section-title {
            font-size: 12px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: #1e1b4b;
            border-bottom: 1px solid #cbd5e1;
            padding-bottom: 8px;
            margin-bottom: 16px;
          }
          .warning-row {
            border: 1px solid #fee2e2;
            border-left: 4px solid #ef4444;
            background-color: #fef2f2;
            border-radius: 8px;
            padding: 12px 16px;
            font-size: 11px;
            color: #991b1b;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
          }
          .warning-id {
            font-weight: 800;
            font-family: monospace;
          }
          .warning-desc {
            font-weight: 600;
            margin-left: 20px;
            flex-1;
          }
          .footer {
            margin-top: 60px;
            border-top: 1px dashed #cbd5e1;
            padding-top: 20px;
            text-align: center;
            font-size: 9px;
            font-weight: 700;
            color: #94a3b8;
            text-transform: uppercase;
            letter-spacing: 0.1em;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="logo">AV CARE<span>OS</span></div>
            <div class="sheet-title">Secure Analytical & Telemetry Ledger (${timeline})</div>
          </div>
          <div class="date-stamp">
            PRINTED ON: ${new Date().toLocaleString('en-US')}<br/>
            STATUS: SECURED ACTIVE AUDIT
          </div>
        </div>

        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-label">Total revenues</div>
            <div class="stat-val">${stats.revenue || '₹14.01M'}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Pending accrued</div>
            <div class="stat-val">${stats.margin || '₹4.93M'}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Bed Occupancies</div>
            <div class="stat-val">82.4%</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Avg medical costs</div>
            <div class="stat-val">₹18,450</div>
          </div>
        </div>

        <div class="section-title">Telemetry Ledger Live Warnings Log</div>
        
        <div class="warning-row">
          <div>
            <span class="warning-id">ID: WL-9051</span>
            <span class="warning-desc">Average lab response clock reached 48 minutes in Ward 4B Pathology.</span>
          </div>
          <span style="font-weight: 800;">HIGH PRIORITY</span>
        </div>

        <div class="warning-row" style="border-color: #fef3c7; border-left-color: #f59e0b; background-color: #fffbeb; color: #92400e;">
          <div>
            <span class="warning-id">ID: WL-8812</span>
            <span class="warning-desc">Billing dip warning: Pharmacy items stock re-allocations decreased gross margin by 4%.</span>
          </div>
          <span style="font-weight: 800;">MEDIUM PRIORITY</span>
        </div>

        <div class="warning-row" style="border-color: #e0f2fe; border-left-color: #0ea5e9; background-color: #f0f9ff; color: #075985;">
          <div>
            <span class="warning-id">ID: WL-7243</span>
            <span class="warning-desc">Ambulance Unit-05 dispatch telemetry down due to localized signal loss.</span>
          </div>
          <span style="font-weight: 800;">LOW PRIORITY</span>
        </div>

        <div class="footer">
          AV CARE OS INTEGRATED ANALYTICS DECK • VERIFIED DIAGNOSTIC TELEMETRY STAMP
        </div>
        <script>
          window.onload = function() {
            window.print();
            window.close();
          }
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
};

export const printLabReport = (report: any, t: (k: string) => string) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  printWindow.document.write(`
    <html>
      <head>
        <title>Clinical Laboratory Diagnostic Report - ${report.id}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
          body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            color: #0f172a;
            background-color: #ffffff;
            padding: 40px;
            margin: 0;
            line-height: 1.5;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 2px solid #cbd5e1;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 20px;
            font-weight: 800;
            letter-spacing: -0.05em;
            color: #7c3aed;
          }
          .logo span {
            color: #06b6d4;
          }
          .report-title {
            font-size: 16px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #1e1b4b;
            margin-top: 4px;
          }
          .details-grid {
            display: grid;
            grid-template-cols: 1fr 1fr;
            gap: 20px;
            margin-bottom: 30px;
            border-bottom: 1px solid #f1f5f9;
            padding-bottom: 20px;
          }
          .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 6px 0;
            font-size: 12px;
          }
          .detail-label {
            font-weight: 700;
            color: #64748b;
            text-transform: uppercase;
            font-size: 9px;
            letter-spacing: 0.05em;
          }
          .detail-val {
            font-weight: 700;
            color: #0f172a;
          }
          .test-container {
            border: 1px solid #e2e8f0;
            border-radius: 16px;
            padding: 24px;
            background-color: #f8fafc;
            margin-bottom: 40px;
          }
          .test-header {
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid #cbd5e1;
            padding-bottom: 12px;
            margin-bottom: 16px;
          }
          .test-name {
            font-size: 14px;
            font-weight: 800;
            color: #0f172a;
            text-transform: uppercase;
          }
          .badge {
            padding: 3px 8px;
            border-radius: 4px;
            font-size: 9px;
            font-weight: 800;
            text-transform: uppercase;
            background-color: #dcfce7;
            color: #15803d;
          }
          .findings {
            font-size: 13px;
            color: #334155;
            line-height: 1.6;
          }
          .signatures {
            margin-top: 60px;
            display: flex;
            justify-content: space-between;
            padding: 0 40px;
          }
          .sig-line {
            border-top: 1px solid #94a3b8;
            width: 180px;
            text-align: center;
            padding-top: 8px;
            font-size: 9px;
            font-weight: 800;
            text-transform: uppercase;
            color: #64748b;
            letter-spacing: 0.05em;
          }
          .footer {
            margin-top: 60px;
            border-top: 1px dashed #cbd5e1;
            padding-top: 20px;
            text-align: center;
            font-size: 9px;
            font-weight: 700;
            color: #94a3b8;
            text-transform: uppercase;
            letter-spacing: 0.1em;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="logo">AV CARE<span>OS</span></div>
            <div class="report-title">Diagnostic Laboratory Report</div>
          </div>
          <div style="text-align: right;">
            <p style="font-size: 11px; font-weight: 800; font-family: monospace; margin: 0; color: #64748b;">REF: ${report.id}</p>
            <p style="font-size: 10px; font-weight: 700; color: #94a3b8; margin: 4px 0 0 0;">CLINICAL LAB SECURE</p>
          </div>
        </div>

        <div class="details-grid">
          <div>
            <div class="detail-row">
              <span class="detail-label">Patient Name</span>
              <span class="detail-val">${t(report.patient)}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Age / Gender</span>
              <span class="detail-val">34 yrs / Male</span>
            </div>
          </div>
          <div>
            <div class="detail-row">
              <span class="detail-label">Lab Pathologist</span>
              <span class="detail-val">${t(report.technician)}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Date of Collection</span>
              <span class="detail-val">${report.date}</span>
            </div>
          </div>
        </div>

        <div class="test-container">
          <div class="test-header">
            <span class="test-name">${t(report.test)}</span>
            <span class="badge">${t(report.status)}</span>
          </div>
          <div class="findings">
            <strong>Diagnostic Summary Findings:</strong><br/>
            All tested telemetry parameters reside within normal clinical limits. The CBC profiles demonstrate a healthy platelet concentration, fully functional red blood cells counts, and well-balanced leukocyte levels appropriate for nominal health standards. No localized pathogen anomalies found in raw blood packets.
          </div>
        </div>

        <div class="signatures">
          <div class="sig-line">Technician Signature</div>
          <div class="sig-line">Verified Pathologist</div>
        </div>

        <div class="footer">
          AV CARE OS CLINICAL DIAGNOSTICS DECK • COMPLETED RECORD LAB SYSTEM TELEMETRY
        </div>
        <script>
          window.onload = function() {
            window.print();
            window.close();
          }
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
};
