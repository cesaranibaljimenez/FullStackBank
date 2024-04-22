const bcrypt = require('bcrypt');
const { checkPassword } = require('../hashPassword');

describe('checkPassword function', () => {
    it('should return true for a correct password', async () => {
        const password = 'secret30';
        const saltRounds = 10;
        const hash = await bcrypt.hash(password, saltRounds);

        const result = await checkPassword(password, hash);
        expect(result).toBe(true);
    });

    it('should return false for an incorrect password', async () => {
        const correctPassword = 'secret30';
        const incorrectPassword = 'wrongPassword';
        const saltRounds = 10;
        const hash = await bcrypt.hash(correctPassword, saltRounds);

        const result = await checkPassword(incorrectPassword, hash);
        expect(result).toBe(false);
    });
});
