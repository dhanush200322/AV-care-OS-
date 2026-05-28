import type { Invoice } from '../../store/useStore';
import type { BillingDepartment, DepartmentBillingBreakdown, UnifiedServiceLine } from './unifiedInvoice.types';

const normalize = (value: string) => value.toLowerCase().trim();

export const inferBillingDepartment = (service: UnifiedServiceLine): BillingDepartment => {
  if (service.department) return service.department;

  const name = normalize(service.name);
  if (name.includes('lab') || name.includes('pathology') || name.includes('scan') || name.includes('cbc') || name.includes('hba1c')) return 'lab';
  if (name.includes('pharmacy') || name.includes('prescription') || name.includes('medicine') || name.includes('qty')) return 'pharmacy';
  if (name.includes('consultation') || name.includes('doctor')) return 'consultation';
  return 'general';
};

export const toUnifiedServiceLines = (invoice: Invoice): UnifiedServiceLine[] =>
  invoice.services.map((service) => ({
    ...service,
    department: inferBillingDepartment(service as UnifiedServiceLine),
  }));

export const mapDepartmentBreakdown = (services: UnifiedServiceLine[]): DepartmentBillingBreakdown[] => {
  const grouped = services.reduce<Record<BillingDepartment, DepartmentBillingBreakdown>>((acc, service) => {
    const department = inferBillingDepartment(service);
    if (!acc[department]) {
      acc[department] = { department, subtotal: 0, items: [] };
    }

    acc[department].items.push({ ...service, department });
    acc[department].subtotal += service.price;
    return acc;
  }, {} as Record<BillingDepartment, DepartmentBillingBreakdown>);

  return Object.values(grouped);
};
