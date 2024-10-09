type UserInfo = {
    id: number,
    name: string,
    gender: string,
    phone: string,
    birth_date: Date,
    created_at: Date
}

type UserLoginInfo = {
    id: number;
    id_users: number;
    email: string;
    password: string;
    tokenResetPassword: string | null;
    tokenResetPasswordExpiresAt: Date | null;
}

type FormattedUserData = {
    name: string,
    gender: string,
    birth_date: string,
    age: number,
    phone: string,
    email: string
}

export const formatUserData = (userInfo: UserInfo, userLoginInfo: UserLoginInfo): FormattedUserData => {
    const { name, gender, birth_date, phone } = userInfo
    const { email } = userLoginInfo

    return { name, gender, birth_date: formatDate(birth_date), age: calculateAgeFromBirthdate(birth_date.toString()), phone, email }
}

export const calculateAgeFromBirthdate = (birthdate: string): number => {
    const birthDate = new Date(birthdate);
    const today = new Date();

    const ageInMilliseconds = today.getTime() - birthDate.getTime();
    const age = Math.floor(ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25));

    return age
}
  
export const formatDate = (databaseDate: Date): string => {
    const day = databaseDate.getDay()
    const month = databaseDate.getMonth() + 1
    const year = databaseDate.getFullYear()

    return `${day}-${month}-${year}`
}