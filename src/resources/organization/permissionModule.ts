import * as R from 'ramda'
import { IUser } from '../user/model';

interface IMember {
    role: String;
    user: IUser | {
        id: string;
    }
}

export interface IPermissionInput {
    name?: String;
    members?: IMember[]
}

const isOwner = R.propEq('role', 'OWNER');
const isAdmin = R.propEq('role', 'ADMIN');
const isUser = R.propEq('role', 'USER');
const isSameUser = (a: IMember, b: IMember) => a.user.id === b.user.id;
const isSameUserAndRole = (a: IMember, b: IMember) => a.role === b.role && a.user.id === b.user.id;

export const membersPermissionFilter = (initialOrg: IPermissionInput, newOrg: IPermissionInput, userId: string) => {
    const user = initialOrg.members && initialOrg.members.find(member => member.user.id === userId);
    const newUser = newOrg.members && newOrg.members.find(member => member.user.id === userId);
    const role = user && user.role;
    const oldUsers = initialOrg.members || [];
    const newUsers = newOrg.members;

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
        const removedUsers = R.differenceWith(isSameUser, oldUsers, newUsers).filter(e => e.user.id !== userId);
        const updatedUsers = R.differenceWith(isSameUserAndRole, oldUsers, newUsers).filter(e => e.user.id !== userId);
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