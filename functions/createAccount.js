export async function createAccount(mailjs) {
    const acc = await mailjs.createOneAccount();

    if (!acc.status) {
        console.error(acc.message);
        return;
    };

    return acc.data;
};
