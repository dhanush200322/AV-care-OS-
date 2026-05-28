import type { PharmacyItem } from '../../store/useStore';
import type { StockDeduction, UnifiedServiceLine } from './unifiedInvoice.types';
import { inferBillingDepartment } from './departmentBillingMapper';
import { useSharedPaymentStore } from './sharedPaymentStore';

const extractQuantity = (serviceName: string) => {
  const unitsMatch = serviceName.match(/(\d+)\s*(?:units?|qty|pkts?|pcs?|items?|u)\b/i);
  const prefixMatch = serviceName.match(/(?:qty\s*x|x\s*|qty\s*[:\-\s]\s*)\s*(\d+)\b/i);
  const bracketsMatch = serviceName.match(/[\(\[`]\s*(\d+)\s*[\)\]`]/);
  const genericMatch = serviceName.match(/\b(\d+)\b(?!\s*(?:mg|g|ml|mcg|cl))\b/i);
  const raw = unitsMatch?.[1] || prefixMatch?.[1] || bracketsMatch?.[1] || genericMatch?.[1];
  const parsed = raw ? parseInt(raw, 10) : 1;

  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
};

const findPharmacyItem = (items: PharmacyItem[], service: UnifiedServiceLine) => {
  if (service.itemId) {
    return items.find((item) => item.id === service.itemId);
  }

  const serviceName = service.name.toLowerCase();
  return items.find((item) => {
    const itemName = item.name.toLowerCase();
    return serviceName === itemName || serviceName.includes(itemName) || itemName.includes(serviceName);
  });
};

export const calculateStockDeductions = (
  invoiceId: string,
  services: UnifiedServiceLine[],
  pharmacyItems: PharmacyItem[],
) => {
  const sharedStore = useSharedPaymentStore.getState();
  const deductions: StockDeduction[] = [];
  const updatedItems = [...pharmacyItems];

  services
    .filter((service) => inferBillingDepartment(service) === 'pharmacy')
    .forEach((service) => {
      const item = findPharmacyItem(updatedItems, service);
      if (!item) return;

      const key = `${invoiceId}:${item.id}:${service.name}`;
      if (sharedStore.hasStockDeduction(key)) {
        deductions.push({
          itemId: item.id,
          itemName: item.name,
          requestedQuantity: service.quantity || extractQuantity(service.name),
          deductedQuantity: 0,
          previousQty: item.qty,
          nextQty: item.qty,
          status: 'skipped',
        });
        return;
      }

      const requestedQuantity = service.quantity || extractQuantity(service.name);
      const deductedQuantity = Math.min(item.qty, requestedQuantity);
      const nextQty = item.qty - deductedQuantity;
      const status = item.qty >= requestedQuantity ? 'deducted' : 'insufficient-stock';

      const itemIndex = updatedItems.findIndex((candidate) => candidate.id === item.id);
      updatedItems[itemIndex] = {
        ...item,
        qty: nextQty,
        status: nextQty === 0 ? 'Out of Stock' : nextQty <= 10 ? 'Low' : 'Available',
      };

      sharedStore.markStockDeducted(key);
      deductions.push({
        itemId: item.id,
        itemName: item.name,
        requestedQuantity,
        deductedQuantity,
        previousQty: item.qty,
        nextQty,
        status,
      });
    });

  return { updatedItems, deductions };
};
