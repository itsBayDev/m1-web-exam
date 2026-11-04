import { Route } from '../../routes/bikes/$bikeId';
import { BikeDetailsPage } from './BikeDetailsPage';

export const BikeDetailsRouteComponent = () => {
  const { bikeId } = Route.useParams();
  return <BikeDetailsPage bikeId={bikeId} />;
};
