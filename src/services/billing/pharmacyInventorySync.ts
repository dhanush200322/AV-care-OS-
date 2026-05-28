import type { PharmacyItem } from '../../store/useStore';
import { calculateStockDeductions } from './stockDeductionEngine';
import type { StockDeduction, UnifiedServiceLine } from './unifiedInvoice.types';

export const syncPharmacyInventoryAfterPayment = (
  invoiceId: string,
  services: UnifiedServiceLine[],
  pharmacyItems: PharmacyItem[],
): { updatedItems: PharmacyItem[]; deductions: StockDeduction[] } =>
  calculateStockDeductions(invoiceId, services, pharmacyItems);
