// Icons exports

type Icon = React.FC<React.SVGProps<SVGSVGElement>> | string;

import { default as IconAddHelper } from './svg/icon/add.svg';
import { default as IconAffiliateHelper } from './svg/icon/affiliate.svg';
import { default as IconArrivalHelper } from './svg/icon/arrival.svg';
import { default as IconCardUserHelper } from './svg/icon/user-card.svg';
import { default as IconDefaultAvatarHelper } from './svg/icon/default-avatar.svg';
import { default as IconDeleteHelper } from './svg/icon/delete.svg';
import { default as IconEditHelper } from './svg/icon/edit.svg';
import { default as IconEmailHelper } from './svg/icon/email.svg';
import { default as IconLinkHelper } from './svg/icon/link.svg';
import { default as IconMemberUserHelper } from './svg/icon/member-user.svg';
import { default as IconPhoneHelper } from './svg/icon/phone.svg';
import { default as IconTooltipHelper } from './svg/icon/tooltip.svg';

export const IconAdd = IconAddHelper as Icon;
export const IconAffiliate = IconAffiliateHelper as Icon;
export const IconArrival = IconArrivalHelper as Icon;
export const IconCardUser = IconCardUserHelper as Icon;
export const IconDefaultAvatar = IconDefaultAvatarHelper as Icon;
export const IconDelete = IconDeleteHelper as Icon;
export const IconEdit = IconEditHelper as Icon;
export const IconEmail = IconEmailHelper as Icon;
export const IconLink = IconLinkHelper as Icon;
export const IconMemberUser = IconMemberUserHelper as Icon;
export const IconPhone = IconPhoneHelper as Icon;
export const IconTooltip = IconTooltipHelper as Icon;
