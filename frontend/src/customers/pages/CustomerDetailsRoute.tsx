import { Route } from '../../routes/customers/$customerId';
import { CustomerDetailsPage } from './CustomerDetailsPage';

export const CustomerDetailsRouteComponent = () => {
  const { customerId } = Route.useParams();
  return <CustomerDetailsPage customerId={customerId} />;
};
