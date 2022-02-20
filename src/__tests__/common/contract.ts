import {IRoute} from '../../core/contract'

export interface IRouteTest extends IRoute {
  parentRoute?: IRoute;
}
