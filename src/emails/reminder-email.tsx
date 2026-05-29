import {
  Body, Button, Container, Head, Heading, Hr,
  Html, Img, Preview, Section, Text,
} from "@react-email/components";
import type { PaymentDetails } from "./invoice-email";

interface ReminderEmailProps {
  companyName:        string;
  logoUrl?:           string;
  clientName:         string;
  invoiceNumber:      string;
  total:              string;
  currency:           string;
  dueDate:            string;
  relativeDueDate:    string;
  isOverdue:          boolean;
  publicInvoiceUrl:   string;
  paymentDetails?:    PaymentDetails;
  paymentInstructions?: string;
}

export function ReminderEmailTemplate({
  companyName, logoUrl, clientName, invoiceNumber,
  total, currency, dueDate, relativeDueDate, isOverdue,
  publicInvoiceUrl, paymentDetails, paymentInstructions,
}: ReminderEmailProps) {

  const hasStructuredPayment = paymentDetails && (
    paymentDetails.bankName || paymentDetails.accountNumber || paymentDetails.paymentLink
  );

  const accentColor = isOverdue ? "#DC2626" : "#2563EB";
  const accentBg    = isOverdue ? "#FFF1F2" : "#EFF6FF";
  const accentBorder = isOverdue ? "#FECDD3" : "#BAE6FD";

  return (
    <Html>
      <Head />
      <Preview>
        {isOverdue
          ? `⚠️ Invoice ${invoiceNumber} is overdue — ${total} from ${companyName}`
          : `Reminder: Invoice ${invoiceNumber} is due ${relativeDueDate} — ${total}`}
      </Preview>
      <Body style={{ backgroundColor: "#F8FAFC", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", margin: 0, padding: 0 }}>
        <Container style={{ maxWidth: 600, margin: "32px auto", padding: "0 16px" }}>

          {/* Header */}
          <Section style={{ backgroundColor: isOverdue ? "#7F1D1D" : "#111827", borderRadius: "16px 16px 0 0", padding: "28px 36px" }}>
            <table style={{ width: "100%" }}>
              <tbody>
                <tr>
                  <td>
                    {logoUrl && (
                      <Img src={logoUrl} alt={companyName} style={{ maxHeight: 36, maxWidth: 120, marginBottom: 10, display: "block" }} />
                    )}
                    <Heading style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#FFFFFF", letterSpacing: "-0.3px" }}>
                      {companyName}
                    </Heading>
                    <Text style={{ margin: "2px 0 0", fontSize: 12, color: isOverdue ? "#FCA5A5" : "#9CA3AF", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                      {isOverdue ? "⚠️ Payment Overdue" : "Payment Reminder"}
                    </Text>
                  </td>
                  <td style={{ textAlign: "right", verticalAlign: "top" }}>
                    <Text style={{ margin: 0, fontSize: 11, color: "#6B7280" }}>Invoice #</Text>
                    <Text style={{ margin: "2px 0 0", fontSize: 14, fontWeight: 700, color: "#F3F4F6", fontFamily: "monospace" }}>{invoiceNumber}</Text>
                  </td>
                </tr>
              </tbody>
            </table>
          </Section>

          {/* Body */}
          <Section style={{ backgroundColor: "#FFFFFF", padding: "36px 36px 0" }}>
            <Text style={{ fontSize: 15, color: "#374151", margin: "0 0 6px" }}>Hi <strong>{clientName}</strong>,</Text>
            <Text style={{ fontSize: 14, color: "#6B7280", margin: "0 0 28px", lineHeight: "1.6" }}>
              {isOverdue
                ? `This is an important notice — invoice ${invoiceNumber} was due on ${dueDate} and remains unpaid. Please arrange payment as soon as possible.`
                : `Just a friendly reminder that invoice ${invoiceNumber} is due ${relativeDueDate}. We'd appreciate your payment on time.`}
            </Text>

            {/* Amount box */}
            <Section style={{
              backgroundColor: accentBg,
              border: `1.5px solid ${accentBorder}`,
              borderRadius: 12,
              padding: "24px",
              textAlign: "center",
              margin: "0 0 28px",
            }}>
              <Text style={{ margin: "0 0 4px", fontSize: 11, fontWeight: 700, color: accentColor, textTransform: "uppercase", letterSpacing: "0.12em" }}>
                {isOverdue ? "Overdue Amount" : "Amount Due"}
              </Text>
              <Heading style={{ margin: "0 0 6px", fontSize: 40, fontWeight: 800, color: "#0F172A", letterSpacing: "-1px" }}>
                {total}
              </Heading>
              <Text style={{ margin: 0, fontSize: 13, color: "#64748B" }}>
                {currency} · {isOverdue ? "Was due" : "Due"} <strong style={{ color: isOverdue ? accentColor : "#0F172A" }}>{dueDate}</strong>
              </Text>
            </Section>

            {/* Details */}
            <Section style={{ backgroundColor: "#F8FAFC", borderRadius: 10, padding: "16px 20px", margin: "0 0 28px", border: "1px solid #E2E8F0" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <tbody>
                  <tr>
                    <td style={{ padding: "4px 0", fontSize: 13, color: "#6B7280", width: "50%" }}>Invoice #</td>
                    <td style={{ padding: "4px 0", fontSize: 13, color: "#0F172A", fontWeight: 600, textAlign: "right", fontFamily: "monospace" }}>{invoiceNumber}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "4px 0", fontSize: 13, color: "#6B7280" }}>Due date</td>
                    <td style={{ padding: "4px 0", fontSize: 13, color: isOverdue ? accentColor : "#0F172A", fontWeight: 700, textAlign: "right" }}>{dueDate}</td>
                  </tr>
                </tbody>
              </table>
            </Section>

            {/* CTA */}
            <Section style={{ textAlign: "center", margin: "0 0 32px" }}>
              <Button
                href={publicInvoiceUrl}
                style={{
                  backgroundColor: isOverdue ? "#DC2626" : "#111827",
                  color: "#FFFFFF",
                  borderRadius: 10,
                  padding: "14px 36px",
                  fontSize: 14,
                  fontWeight: 700,
                  textDecoration: "none",
                  display: "inline-block",
                }}
              >
                {isOverdue ? "Pay Now →" : "View Invoice →"}
              </Button>
            </Section>
          </Section>

          {/* Payment instructions */}
          {(hasStructuredPayment || paymentInstructions) && (
            <Section style={{ backgroundColor: "#FFFFFF", padding: "0 36px 32px" }}>
              <Hr style={{ borderColor: "#E2E8F0", margin: "0 0 24px" }} />
              <Text style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", margin: "0 0 14px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Payment Details
              </Text>
              {hasStructuredPayment ? (
                <Section style={{ backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 10, padding: "16px 20px" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <tbody>
                      {paymentDetails?.bankName      && <tr><td style={{ padding: "4px 0", fontSize: 13, color: "#6B7280", width: "40%" }}>Bank</td><td style={{ padding: "4px 0", fontSize: 13, color: "#0F172A", fontWeight: 600 }}>{paymentDetails.bankName}</td></tr>}
                      {paymentDetails?.accountName   && <tr><td style={{ padding: "4px 0", fontSize: 13, color: "#6B7280" }}>Account name</td><td style={{ padding: "4px 0", fontSize: 13, color: "#0F172A", fontWeight: 600 }}>{paymentDetails.accountName}</td></tr>}
                      {paymentDetails?.accountNumber && <tr><td style={{ padding: "4px 0", fontSize: 13, color: "#6B7280" }}>Account no.</td><td style={{ padding: "4px 0", fontSize: 13, color: "#0F172A", fontWeight: 700, fontFamily: "monospace" }}>{paymentDetails.accountNumber}</td></tr>}
                      {paymentDetails?.sortCode      && <tr><td style={{ padding: "4px 0", fontSize: 13, color: "#6B7280" }}>Sort code</td><td style={{ padding: "4px 0", fontSize: 13, color: "#0F172A", fontWeight: 700, fontFamily: "monospace" }}>{paymentDetails.sortCode}</td></tr>}
                      {paymentDetails?.iban          && <tr><td style={{ padding: "4px 0", fontSize: 13, color: "#6B7280" }}>IBAN</td><td style={{ padding: "4px 0", fontSize: 13, color: "#0F172A", fontFamily: "monospace" }}>{paymentDetails.iban}</td></tr>}
                      {paymentDetails?.swiftBic      && <tr><td style={{ padding: "4px 0", fontSize: 13, color: "#6B7280" }}>Swift / BIC</td><td style={{ padding: "4px 0", fontSize: 13, color: "#0F172A", fontFamily: "monospace" }}>{paymentDetails.swiftBic}</td></tr>}
                    </tbody>
                  </table>
                  {paymentDetails?.paymentLink && (
                    <Section style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid #E2E8F0", textAlign: "center" }}>
                      <Button href={paymentDetails.paymentLink} style={{ backgroundColor: "#2563EB", color: "#FFFFFF", borderRadius: 8, padding: "10px 24px", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
                        {paymentDetails.paymentLinkLabel || "Pay Online →"}
                      </Button>
                    </Section>
                  )}
                </Section>
              ) : (
                <Text style={{ fontSize: 13, color: "#374151", whiteSpace: "pre-wrap", lineHeight: "1.7", margin: 0, backgroundColor: "#F8FAFC", padding: "14px 18px", borderRadius: 8, border: "1px solid #E2E8F0" }}>
                  {paymentInstructions}
                </Text>
              )}
            </Section>
          )}

          {/* Footer */}
          <Section style={{ backgroundColor: "#F8FAFC", borderRadius: "0 0 16px 16px", padding: "16px 36px", borderTop: "1px solid #E2E8F0", textAlign: "center" }}>
            <Text style={{ color: "#9CA3AF", fontSize: 12, margin: 0, lineHeight: "1.6" }}>
              This reminder was sent by <strong style={{ color: "#6B7280" }}>{companyName}</strong> via <strong style={{ color: "#374151" }}>Invoiceser</strong>.
              If you have already paid, please disregard this message.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default ReminderEmailTemplate;
