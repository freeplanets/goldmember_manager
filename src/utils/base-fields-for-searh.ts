export const USER_DEFAULT_FIELDS = 'id username displayName role authRole phone isActive lastLogin lastLoginIp lastLoginDevice';
export const USER_DETAIL_FIELDS = `${USER_DEFAULT_FIELDS} devices`;
export const MEMBER_DEFAULT_FIELDS = 'id systemId name displayName gender birthDate membershipType isDirector joinDate pic lastLogin creditScore';
export const MEMBER_DETAIL_FIELDS = `${MEMBER_DEFAULT_FIELDS} phone email address membershipLastModified joinDate expiryDate notes lastVisit refSystemId directorStatusLastModified loginloginIp loginLoginDevice creditHistory`;
export const COUPON_BATCH_DEFAULT_FIELDS = 'id name type issueMode targetGroups extendFilter issueDate status numberOfIssued numberOfIssuers';
export const COUPON_BATCH_DETAIL_FIELDS = `${COUPON_BATCH_DEFAULT_FIELDS} frequency validMonths description birthMonth mode couponsPerPerson expiryDate creator authorizer updater`;
export const TEAM_DEFAULT_FIELDS = 'id name status creditScore logoUrl description contacter';
export const TEAM_DETAIL_FIELDS = `${TEAM_DEFAULT_FIELDS} lastActivity members`;