import AccountService from '../utils/services/Account.service';
import BrokerService from '../utils/services/Broker.service';
import SelectFilter from './SelectFilter';

export default function AccountFilters() {
  const brokers = BrokerService.getBrandNames();
  const status = AccountService.getStatusNames();
  const actives = [
    ['true', '활성'],
    ['false', '비활성']
  ];
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}
    >
      <SelectFilter title='계좌명' data={brokers} keyword='broker_id' />
      <SelectFilter title='계좌 상태' data={status} keyword='status' />
      <SelectFilter
        title='계좌 활성화 여부'
        data={actives}
        keyword='is_active'
      />
    </div>
  );
}
