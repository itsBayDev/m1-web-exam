import { createFileRoute } from '@tanstack/react-router';
import { CustomerDetailsRouteComponent } from '../../customers/pages/CustomerDetailsRoute';

export const Route = createFileRoute('/customers/$customerId')({
  component: CustomerDetailsRouteComponent,
});
