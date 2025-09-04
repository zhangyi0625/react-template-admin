import React from 'react'
import CabinTaskTemplate from '../CabinTaskTemplate'
// export default <CabinTaskTemplate carrier="MSK" setting={null} />

const MskTaskTem: React.FC = () => {
  return <CabinTaskTemplate key={'MSK'} carrier="MSK" setting={null} />
}

export default MskTaskTem
