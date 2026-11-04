import { createFileRoute } from '@tanstack/react-router';
import { BikeDetailsRouteComponent } from '../../bikes/pages/BikeDetailsRoute';

export const Route = createFileRoute('/bikes/$bikeId')({
  component: BikeDetailsRouteComponent,
});
