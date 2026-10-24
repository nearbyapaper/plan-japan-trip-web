"use client";

// เปิดหน้าต่างพิมพ์ของเบราว์เซอร์ เลือก "บันทึกเป็น PDF" ได้ (บน iPhone: แชร์ → พิมพ์ → แชร์เป็น PDF)
export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="no-print rounded-full border border-line px-4 py-2 text-sm hover:border-accent hover:text-accent"
    >
      🖨 印刷・PDF保存
    </button>
  );
}
