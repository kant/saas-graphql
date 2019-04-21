import * as R from 'ramda'

interface IMember {
    role: string;
    user: {
        id: string;
    }
}

export interface IPermissionInput {
    name?: String;
    members: IMember[]
}

const isOwner = R.propEq('role', 'OWNER')
const atLeastOneOwner = R.any(isOwner)


export const membersPermissionFilter = (initialOrg: IPermissionInput, newOrg: IPermissionInput, userId: string) => {
    const user = initialOrg.members.find(member => member.user.id === userId);
    const newUser = newOrg.members.find(member => member.user.id === userId);
    const role = R.path(['role'], user);
    if (!role) {
        return false;
    }
    if (role === 'OWNER') {
        return atLeastOneOwner(newOrg.members)
    }
}