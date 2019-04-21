import * as R from 'ramda'

interface IMember {
    role: string;
    user: {
        id: string;
    }
}

export interface IPermissionInput {
    name?: String;
    members?: IMember[]
}

const isOwner = R.propEq('role', 'OWNER')
const atLeastOneOwner = R.any(isOwner)


export const membersPermissionFilter = (initialOrg: IPermissionInput, newOrg: IPermissionInput, userId: string) => {
    const user = initialOrg.members && initialOrg.members.find(member => member.user.id === userId);
    const newUser = newOrg.members && newOrg.members.find(member => member.user.id === userId);
    const role = R.path(['role'], user);
    if (!role) {
        return false;
    }
    if (role === 'OWNER' && newOrg.members) {
        return atLeastOneOwner(newOrg.members)
    }

    if (role === 'USER') {
        if (newOrg.name && newOrg.name !== initialOrg.name) {
            return false;
        }
        if (newOrg.members && initialOrg.members && R.symmetricDifference(initialOrg.members, newOrg.members).length === 1 && !newUser) {
            return true
        } else {
            return false
        }
    }
}