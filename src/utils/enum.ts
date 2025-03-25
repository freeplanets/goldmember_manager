export enum ERROR_TYPE {
  SYSTEM = 'SYSTEM',
  DEVELOPER = 'DEVELOPER',
}

export enum LEVEL {
  //SUPER = 'SUPER',
  ADMIN = 'ADMIN',        // 系統管理員 
  MANAGER = 'MANAGER',    // 場地經理
  WORKER = 'WORKER',      // 工作人員
  RECEPTION = 'RECEPTION',// 櫃檯接待
  //USER = 'USER',
}

export enum DS_LEVEL {
  CHAIRMAN = 'chairman',      // 董事長
  VICE_CHAIRMAN = 'vice_chairman',  // 副董事長
  MANAGING_DIRECTOR = 'managing_director', // 常務董事
  DIRECTOR = 'director', // 董事
  STANDING_SUPERVISOR = 'standing_supervisor',  // 常務監察人
  SUPERVISOR = 'supervisor',  // 監察人
  NONE = 'none',
}

export enum MEMBER_LEVEL {
  GENERAL_MEMBER = 'general_member',
  DEPENDENTS = 'dependents',
  SHARE_HOLDER = 'share_holder', 
}

export enum ANNOUNCEMENT_TYPE {
  ROUTINE = 'routine',
  GAME = 'game',
  ANNIVERSARY = 'ANNIVERSARY',
}

export enum ANNOUNCEMENT_GROUP {
  ALL = 'all',
  SHARE_HOLDER = 'share_holder',
  BIRTH_OF_MONTH = 'birthday_of_the_month',
  GENERAL_MEMBER = 'general_member',
  DEPENDENTS = 'dependents',
  DIRECTOR_SUPERVISOR = 'director_and_supervisor',
}

export enum SEARCH_GROUP_METHOD {
  INTERSECTION = 'intersection',
  JOINT = 'joint',
}

export enum COUPON_ISSUANCE_METHOD {
  MANUAL = 0,
  AUTOMATIC = 1,
}

export enum COUPON_STATUS {
  NOT_USED = 0,
  USED = 1,
  CANCELED = 2,
  NOT_ISSUED = 3,
}

export enum COUPON_TYPES {
  BIRTH = 'birth',
  SHAREHOLDER = 'shareholder',
  DIRECTOR = 'director',
  RECOMMEND = 'recommend',
  SPECIAL = 'special',
}

export enum GENDER {
  LEGAL_PERSON = 0,
  MALE = 1,
  FEMALE = 2,
}