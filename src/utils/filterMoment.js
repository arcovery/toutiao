import moment from 'moment'
import 'moment/dist/locale/zh-cn'

export const filterMoment = (value) => {
  return moment(value).fromNow()
}
