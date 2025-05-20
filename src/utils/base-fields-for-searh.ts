export const USER_DEFAULT_FIELDS = 'id username displayName role authRole phone isActive lastLogin lastLoginIp lastLoginDevice';
export const USER_DETAIL_FIELDS = `${USER_DEFAULT_FIELDS} devices`;
export const MEMBER_DEFAULT_FIELDS = 'id systemId name displayName gender birthDate membershipType isDirector joinDate pic lastLogin';
export const MEMBER_DETAIL_FIELDS = `${MEMBER_DEFAULT_FIELDS} membershipLastModified joinDate expiryDate notes lastVisit refSystemId directorStatusLastModified loginloginIp loginLoginDevice`;
export const COUPON_BATCH_DEFAULT_FIELDS = 'id name type issueMode targetGroups extendFilter issueDate status';
export const COUPON_BATCH_DETAIL_FIELDS = `${COUPON_BATCH_DEFAULT_FIELDS} desdcription birthMonth mode couponsPerPerson expiryDate targetDescription authorizer `;