import R from 'ramda'
import { IOrganization } from './model';

interface IMemberInput {
    role: String;
    user: String;
}

export interface IPermissionInput {
    name: String;
    members: IMemberInput[]
}

const isOwner = R.propEq('role', 'OWNER');
const isAdmin = R.propEq('role', 'ADMIN');
const isSameUser = (a: IMemberInput, b: IMemberInput) => a.user === b.user;
const isSameUserAndRole = (a: IMemberInput, b: IMemberInput) => a.role === b.role && a.user === b.user;

export const mapOrganizationToInput: ((org: any) => IPermissionInput) = (a) => {
    const output = {
        name: a.name,
        members: a.members.map(i => ({ role: i.role, user: i.user.id }))
    }
    return output;
};

export const membersPermissionFilter = (initialOrg: IPermissionInput, newOrg: IPermissionInput, userId: string) => {
    const oldUsers = initialOrg.members
    const newUsers = newOrg.members
    const user = oldUsers.find(member => member.user === userId);
    const newUser = newUsers.find(member => member.user === userId);
    const role = user && user.role;

    // If the user is not member of the organization fail the call
    if(!role) {
        throw new Error('Organization not found');
    }

    if (initialOrg.name !== newOrg.name && role !== 'OWNER') {
        throw new Error('Not allowed to change the name of this organization');
    } else if (!newUsers) {
        return true;
    }

    // If the user is owner and there will be at least one other owner pass
    if (newUsers && (role === 'OWNER' && newUsers.filter(isOwner).length === 0)) {
        throw new Error('Can not leave an organization if you are the last owner, make somebody else owner first.');
    } else if (role === 'OWNER' && newUsers.filter(isOwner).length > 0) {
        return true;
    }

    // If the user is a user the only change allowed is to leave the organization
    const allDiffs = R.symmetricDifference(newUsers, oldUsers);
    if (role === 'USER' && (allDiffs.length > 1 || (allDiffs.length === 1 && newUser))) {
        throw new Error('As a user, you can only remove yourself from this organization');
    } else if (role === 'USER' && (allDiffs.length === 0 || (allDiffs.length === 1 && !newUser))){
        return true;
    }

    if (role === 'ADMIN') {
        const removedUsers = R.differenceWith(isSameUser, oldUsers, newUsers).filter(e => e.user !== userId);
        const updatedUsers = R.differenceWith(isSameUserAndRole, oldUsers, newUsers).filter(e => e.user !== userId);
        const sameOWners = R.symmetricDifferenceWith(isSameUserAndRole, oldUsers.filter(isOwner), newUsers.filter(isOwner)).length === 0;
        
        if(!sameOWners) {
            throw new Error('As an admin, you can not edit owners');
        } else if (R.any(isAdmin)(removedUsers)) {
            throw new Error('As an admin, you can not remove other Admins');
        } else if (R.any(isAdmin)(updatedUsers)) {
            throw new Error('As an admin, you can not edit other Admins');
        } else {
            return true
        }
    }
    
}