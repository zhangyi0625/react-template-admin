import styles from '../AffiliateManage.module.scss';

type AffiliateFinancialDetailProps = {
  wallet: {
    balance: number;
    bond: number;
  };
  jumpWalletPage: (url: string) => void;
};

const AffiliateFinancialDetail: React.FC<AffiliateFinancialDetailProps> = ({
  wallet,
  jumpWalletPage,
}) => {
  const { balance, bond } = wallet;

  const getCurrency = (amount: number, local = 'es-US', currency = 'USD') => {
    return new Intl.NumberFormat(local, {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };
  return (
    <>
      <div className="bg-white rounded-[6px] p-[20px] w-full my-[16px]">
        <p className={styles['basic-title']}>用户账户资金</p>
        <div className={styles['wallet-item']}>
          <div className="flex flex-col">
            <div>钱包账户</div>
            <div className="text-2xl font-medium">
              {getCurrency(bond, 'zh-CN', 'CNY')}
            </div>
          </div>

          <div
            className={styles['button']}
            onClick={() => jumpWalletPage('/capitalManage/FinancialDetails')}
          >
            查看
          </div>
        </div>
        <div className={styles['wallet-item']}>
          <div className="flex flex-col">
            <div>保证金账户</div>
            <div className="text-2xl font-medium">
              {getCurrency(balance, 'zh-CN', 'CNY')}
            </div>
          </div>
          <div
            className={styles['button']}
            onClick={() => jumpWalletPage('/capitalManage/FinancialDetails')}
          >
            查看
          </div>
        </div>
      </div>
    </>
  );
};

export default AffiliateFinancialDetail;
