import bcrypt from 'bcrypt';

export const passwordHash = async (password) => {
  const bcryptSalt = await bcrypt.genSalt();
  return await bcrypt.hash(password, bcryptSalt);
};
