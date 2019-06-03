import { query } from '../utils/mysql';
import _HomeDao from './dao.home';

const _props = { Query: query };

export const HomeDao = new _HomeDao(_props);