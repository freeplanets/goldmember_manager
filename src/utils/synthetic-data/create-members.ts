// import { fakerZH_TW } from '@faker-js/faker';
// import {v1 as uuidv1} from 'uuid';
// import { getMongoDB } from '../database/mongodb';
// import { Member, MemberSchema } from '../../dto/schemas/member.schema';
// const faker = fakerZH_TW;
// faker.seed(123); // Fix the seed for consistent UUID generation
// enum GENDER {
//     LEGAL_PERSON = 0,
//     MALE = 1,
//     FEMALE = 2,
// }
// enum MEMBER_LEVEL {
//     GENERAL_MEMBER = 'general_member',
//     DEPENDENTS = 'dependents',
//     SHARE_HOLDER = 'share_holder', 
// }
// interface IMember {
//     id?: string;
//     name?: string;
//     displayName?: string;
//     //password?: string;
//     gender?: GENDER;
//     birthDate?: string;
//     birthMonth?: number;
//     email?: string;
//     phone?: string;
//     address?: string;
//     handicap: number;
//     membershipType?: MEMBER_LEVEL;  // 
//     joinDate?: string;
// }
// function getBirthMonth(birthday:string) {
//     let spt = "/";
//     if (birthday.indexOf(spt) == -1) spt = "-";
//     const pos1 = birthday.indexOf(spt);
//     const pos2 = birthday.indexOf(spt, pos1+1)
//     if (pos1 ==-1 || pos2 ==-1) return 0;
//     let newStr = birthday.substring(pos1+1, pos2);
//     return Number(newStr);
// }
// export function generateSyntheticMembers(count: number): IMember[] {
//     const members: IMember[] = [];
//     for (let i = 0; i < count; i++) {
//         const gender = faker.helpers.arrayElement([GENDER.MALE, GENDER.FEMALE]);
//         const membershipType = faker.helpers.arrayElement([
//             MEMBER_LEVEL.GENERAL_MEMBER,
//             MEMBER_LEVEL.DEPENDENTS,
//             MEMBER_LEVEL.SHARE_HOLDER,
//         ]);
//         const mbr:IMember = {
//             id: uuidv1(),
//             name: faker.person.fullName(), //faker.name.fullName(),
//             displayName: faker.internet.displayName(),//faker.internet.userName(),
//             // password: 'Abc123456',
//             gender,
//             birthDate: faker.date.past({ years: 50 }).toISOString().split('T')[0],
//             email: faker.internet.email(),
//             phone: faker.phone.number(),
//             address: faker.location.streetAddress(), //faker.address.streetAddress(),
//             handicap: faker.number.int({ min: 30, max: 70 }),
//             membershipType,
//             joinDate: faker.date.past({ years: 50 }).toISOString().split('T')[0],
//         }
//         mbr.birthMonth = Number(getBirthMonth(mbr.birthDate));
//         members.push(mbr);
//     }
//     return members;
// }
// console.log(generateSyntheticMembers(10));

// export const InsertMembersIfNotExists = async () => {
//     console.log("InsertMembersIfNotExists");
//     const db = getMongoDB();
//     const memberModel = (await db).model(Member.name, MemberSchema);
//     const count = await memberModel.countDocuments();
//     if (count > 10) {
//         console.log(count, "Members already exist in the database.");
//         return;
//     }
//     const members = generateSyntheticMembers(1000);
//     const rlt = await memberModel.insertMany(members);
//     console.log(`Inserted ${rlt.length} members into the database.`);
// }