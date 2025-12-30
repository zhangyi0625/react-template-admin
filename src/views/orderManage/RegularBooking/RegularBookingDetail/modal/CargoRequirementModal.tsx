import React, { memo, useEffect, useState } from 'react';
import DragModal from '@/components/modal/DragModal';
import {
  FastBookingCargoRequirementOptions,
  RegularBookingCargoRequirementOptions,
} from './config';

export type CargoRequirementModalProps = {
  params: {
    visible: boolean;
    editRow: any;
  };
  source: 'RegularBooking' | 'FastBooking';
  onCancel: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

const CargoRequirementModal: React.FC<CargoRequirementModalProps> = memo(
  ({ params, source, onCancel }) => {
    const [loading, setLoading] = useState<boolean>(true);

    const [options, setoptions] = useState(
      RegularBookingCargoRequirementOptions
    );

    useEffect(() => {
      if (!params.visible) return;
      getOptionsByCarrier(params.editRow?.bookingInfo, params.editRow?.carrier);
    }, [params.visible]);

    const getOptionsByCarrier = (options: any, carrier: string) => {
      let arr = (
        source === 'RegularBooking'
          ? RegularBookingCargoRequirementOptions
          : FastBookingCargoRequirementOptions
      ).filter((ele) => ele.includeCarrier.includes(carrier));
      arr.map((item) => {
        item.value = item.replaceFn
          ? item.replaceFn(options[item.key])
          : options[item.key];
      });
      setoptions(arr);
      setLoading(false);
    };

    return (
      <DragModal
        title="补充资料"
        width="480px"
        open={params.visible}
        loading={loading}
        onCancel={onCancel}
        footer={null}
      >
        {options.map((item, index) => (
          <div
            className="flex items-center justify-between my-[10px]"
            key={index}
          >
            <p className="text-light-grey">{item.label}</p>
            <p className="text-dull-grey">{item.value}</p>
          </div>
        ))}
      </DragModal>
    );
  }
);

export default CargoRequirementModal;
