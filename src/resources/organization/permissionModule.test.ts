import { membersPermissionFilter, mapOrganizationToInput } from  './permissionModule';
import { IOrganization } from './model';

export const generateState = () => ({
    name: 'INITIAL NAME',
    members: [{
        role: 'OWNER',
        user: '0',
    }, {
        role: 'OWNER',
        user: '1',
    },{
        role: 'ADMIN',
        user: '2',
    },{
        role: 'ADMIN',
        user: '3',
    },{
        role: 'USER',
        user: '4',
    },{
        role: 'USER',
        user: '5',
    }]
})

const passiveOwner = 1
const passiveAdmin = 3
const passiveUser = 5

const changeName = (actingID: string, role: string) => {
    const initialState =  {
        name: 'TEST',
        members: [{
            role: 'OWNER',
            user: '0'
        },{
            role,
            user: actingID
        }]
    }
    const newState = {
        name: 'NEW TEST NAME',
        members: [{
            role: 'OWNER',
            user: '0'
        },{
            role,
            user: actingID
        }]
    }
    return membersPermissionFilter(initialState, newState, actingID)
}

const removeOwner = (actingID: string) => {
    const initialState = generateState()
    const newState = generateState();
    newState.members.splice(passiveOwner,1);
    return membersPermissionFilter(initialState, newState, actingID)
}

const removeAdmin = (actingID: string) => {
    const initialState = generateState()
    const newState = generateState();
    newState.members.splice(passiveAdmin,1);
    return membersPermissionFilter(initialState, newState, actingID)
}

const removeUser = (actingID: string) => {
    const initialState = generateState()
    const newState = generateState();
    newState.members.splice(passiveUser,1);
    return membersPermissionFilter(initialState, newState, actingID)
}

const upgradeUserToAdmin = (actingID: string) => {
    const initialState = generateState()
    const newState = generateState();
    newState.members[passiveUser].role = 'ADMIN'
    return membersPermissionFilter(initialState, newState, actingID)
}

const upgradeUserToOwner = (actingID: string) => {
    const initialState = generateState()
    const newState = generateState();
    newState.members[passiveUser].role = 'OWNER'
    return membersPermissionFilter(initialState, newState, actingID)
}

const downGradeAdminToUser = (actingID: string) => {
    const initialState = generateState()
    const newState = generateState();
    newState.members[passiveAdmin].role = 'USER'
    return membersPermissionFilter(initialState, newState, actingID)
}

const upgradeAdminToOwner = (actingID: string) => {
    const initialState = generateState()
    const newState = generateState();
    newState.members[passiveAdmin].role = 'OWNER'
    return membersPermissionFilter(initialState, newState, actingID)
}

const downGradeOwnerToUser = (actingID: string) => {
    const initialState = generateState()
    const newState = generateState();
    newState.members[passiveOwner].role = 'USER'
    return membersPermissionFilter(initialState, newState, actingID)
}

const downGradeOwnerToAdmin = (actingID: string) => {
    const initialState = generateState()
    const newState = generateState();
    newState.members[passiveOwner].role = 'ADMIN'
    return membersPermissionFilter(initialState, newState, actingID)
}

const removeSelf = (actingID: string) => {
    const initialState = generateState()
    const newState = generateState();
    newState.members.splice(parseInt(actingID, 10),1);
    return membersPermissionFilter(initialState, newState, actingID)
}

const setSelfAsUser = (actingID: string) => {
    const initialState = generateState()
    const newState = generateState();
    newState.members[actingID].role = 'USER'
    return membersPermissionFilter(initialState, newState, actingID)
}

const setSelfAsAdmin = (actingID: string) => {
    const initialState = generateState()
    const newState = generateState();
    newState.members[actingID].role = 'ADMIN'
    return membersPermissionFilter(initialState, newState, actingID)
}

const setSelfAsOwner = (actingID: string) => {
    const initialState = generateState()
    const newState = generateState();
    newState.members[actingID].role = 'OWNER'
    return membersPermissionFilter(initialState, newState, actingID)
}

const inviteUser = (actingID: string) => {
    const initialState = generateState()
    const newState = generateState();
    newState.members.push({
        role: 'USER',
        user: 'new'
    })
    return membersPermissionFilter(initialState, newState, actingID)
}

const inviteAdmin = (actingID: string) => {
    const initialState = generateState()
    const newState = generateState();
    newState.members.push({
        role: 'ADMIN',
        user: 'new'
    })
    return membersPermissionFilter(initialState, newState, actingID)
}

const inviteOwner = (actingID: string) => {
    const initialState = generateState()
    const newState = generateState();
    newState.members.push({
        role: 'OWNER',
        user: 'new'
    })
    return membersPermissionFilter(initialState, newState, actingID)
}

describe('Map Organization To MemberInput', () => {
    it('should map an Organization to a MemberInput', () => {
        const source = {
            name: 'TEST',
            members: [{
                role: 'TEST',
                user: {
                    id: 'testId'
                }
            }]
        };
        const expected = {
            name: 'TEST',
            members: [{
                role: 'TEST',
                user: 'testId'
            }]
        }
        expect(mapOrganizationToInput(source)).toEqual(expected)
    })
})

describe('OWNER Permissions Tests', () => {
    const actingID = '0'
    it('should allow an OWNER to change name of the organization', () => {
        expect(changeName(actingID, 'OWNER')).toBe(true)
    })

    it('should allow an OWNER to remove an OWNER', () => {
        expect(removeOwner(actingID)).toBe(true);
    })

    it('should allow an OWNER to remove an ADMIN', () => {
        expect(removeAdmin(actingID)).toBe(true);
    })

    it('should allow an OWNER to remove an USER', () => {
        expect(removeUser(actingID)).toBe(true);
    })

    it('should allow an OWNER to set an USER as an ADMIN', () => {
        expect(upgradeUserToAdmin(actingID)).toBe(true);
    })

    it('should allow an OWNER to set an USER as an OWNER', () => {
        expect(upgradeUserToOwner(actingID)).toBe(true);
    })

    it('should allow an OWNER to set an ADMIN as an USER', () => {
        expect(downGradeAdminToUser(actingID)).toBe(true);
    })

    it('should allow an OWNER to set an ADMIN as an OWNER', () => {
        expect(upgradeAdminToOwner(actingID)).toBe(true);
    })

    it('should allow an OWNER to set an OWNER as an USER', () => {
        expect(downGradeOwnerToUser(actingID)).toBe(true);
    })

    it('should allow an OWNER to set an OWNER as an ADMIN', () => {
        expect(downGradeOwnerToAdmin(actingID)).toBe(true);
    })

    it('should allow an OWNER to leave the organization', () => {
        expect(removeSelf(actingID)).toBe(true);
    })
    
    it('should not allow an OWNER to leave the organization if no other owner', () => {
        const initialState = generateState()
        initialState.members.splice(1, 1)
        const newState = generateState();
        newState.members.splice(0,2);
        const result = () => membersPermissionFilter(initialState, newState, actingID)
        expect(result).toThrowError('Can not leave an organization if you are the last owner, make somebody else owner first.');
    })

    it('should allow an OWNER to set himself as ADMIN', () => {
        expect(setSelfAsAdmin(actingID)).toBe(true);
    })

    it('should allow an OWNER to set himself as USER', () => {
        expect(setSelfAsUser(actingID)).toBe(true);
    })

    it('should allow an OWNER to set himself as OWNER', () => {
        expect(setSelfAsOwner(actingID)).toBe(true);
    })

    it('should allow an OWNER to invite a USER', () => {
        expect(inviteUser(actingID)).toBe(true);
    })

    it('should allow an OWNER to invite an ADMIN', () => {
        expect(inviteAdmin(actingID)).toBe(true);
    })

    it('should allow an OWNER to invite an OWNER', () => {
        expect(inviteOwner(actingID)).toBe(true);
    })    
})

describe('ADMIN Permissions Tests', () => {
    const actingID = '2'
    it('should not allow a ADMIN to change name of the organization', () => {
        expect(() => changeName(actingID, 'ADMIN')).toThrowError('Not allowed to change the name of this organization')
    })

    it('should not allow a ADMIN to remove an OWNER', () => {
        expect(() => removeOwner(actingID)).toThrow()
    })

    it('should not allow a ADMIN to remove an ADMIN', () => {
        expect(() => removeAdmin(actingID)).toThrow()
    })

    it('should allow a ADMIN to remove an USER', () => {
        expect(removeUser(actingID)).toBe(true);
    })

    it('should allow a ADMIN to set an USER as an ADMIN', () => {
        expect(upgradeUserToAdmin(actingID)).toBe(true);
    })

    it('should not allow a ADMIN to set an USER as an OWNER', () => {
        expect(() => upgradeUserToOwner(actingID)).toThrow()
    })

    it('should not allow a ADMIN to set an ADMIN as an USER', () => {
        expect(() => downGradeAdminToUser(actingID)).toThrow()
    })

    it('should not allow a ADMIN to set an ADMIN as an OWNER', () => {
        expect(() => upgradeAdminToOwner(actingID)).toThrow()
    })

    it('should not allow a ADMIN to set an OWNER as an USER', () => {
        expect(() => downGradeOwnerToUser(actingID)).toThrow()
    })

    it('should not allow a ADMIN to set an OWNER as an ADMIN', () => {
        expect(() => downGradeOwnerToAdmin(actingID)).toThrow()
    })

    it('should allow a ADMIN to leave the organization', () => {
        expect(removeSelf(actingID)).toBe(true);
    })

    it('should allow a ADMIN to set himself as ADMIN', () => {
        expect(setSelfAsAdmin(actingID)).toBe(true);
    })

    it('should allow a ADMIN to set himself as USER', () => {
        expect(setSelfAsUser(actingID)).toBe(true);
    })

    it('should not allow a ADMIN to set himself as OWNER', () => {
        expect(() => setSelfAsOwner(actingID)).toThrow()
    })

    it('should allow a ADMIN to invite a USER', () => {
        expect(inviteUser(actingID)).toBe(true);
    })

    it('should allow a ADMIN to invite an ADMIN', () => {
        expect(inviteAdmin(actingID)).toBe(true);
    })

    it('should not allow a ADMIN to invite an OWNER', () => {
        expect(() => inviteOwner(actingID)).toThrow()
    })    
})

describe('USER Permissions Tests', () => {
    const actingID = '4'
    it('should not allow a USER to change name of the organization', () => {
        expect(() => changeName(actingID, 'USER')).toThrowError('Not allowed to change the name of this organization')
    })

    it('should not allow a USER to remove an OWNER', () => {
        expect(() =>removeOwner(actingID)).toThrowError('As a user, you can only remove yourself from this organization');
    })

    it('should not allow a USER to remove an ADMIN', () => {
        expect(() => removeAdmin(actingID)).toThrowError('As a user, you can only remove yourself from this organization');
    })

    it('should not allow a USER to remove an USER', () => {
        expect(() => removeUser(actingID)).toThrowError('As a user, you can only remove yourself from this organization');
    })

    it('should not allow a USER to set an USER as an ADMIN', () => {
        expect(() => upgradeUserToAdmin(actingID)).toThrowError('As a user, you can only remove yourself from this organization');
    })

    it('should not allow a USER to set an USER as an OWNER', () => {
        expect(() => upgradeUserToOwner(actingID)).toThrowError('As a user, you can only remove yourself from this organization');
    })

    it('should not allow a USER to set an ADMIN as an USER', () => {
        expect(() => downGradeAdminToUser(actingID)).toThrowError('As a user, you can only remove yourself from this organization');
    })

    it('should not allow a USER to set an ADMIN as an OWNER', () => {
        expect(() => upgradeAdminToOwner(actingID)).toThrowError('As a user, you can only remove yourself from this organization');
    })

    it('should not allow a USER to set an OWNER as an USER', () => {
        expect(() => downGradeOwnerToUser(actingID)).toThrowError('As a user, you can only remove yourself from this organization');
    })

    it('should not allow a USER to set an OWNER as an ADMIN', () => {
        expect(() => downGradeOwnerToAdmin(actingID)).toThrowError('As a user, you can only remove yourself from this organization');
    })

    it('should allow a USER to leave the organization', () => {
        expect(removeSelf(actingID)).toBe(true);
    })

    it('should not allow a USER to set himself as ADMIN', () => {
        expect(() => setSelfAsAdmin(actingID)).toThrowError('As a user, you can only remove yourself from this organization');
    })

    it('should not allow a USER to set himself as USER', () => {
        expect(setSelfAsUser(actingID)).toBe(true)
    })

    it('should not allow a USER to set himself as OWNER', () => {
        expect(() => setSelfAsOwner(actingID)).toThrowError('As a user, you can only remove yourself from this organization');
    })

    it('should not allow a USER to invite a USER', () => {
        expect(() => inviteUser(actingID)).toThrowError('As a user, you can only remove yourself from this organization');
    })

    it('should not allow a USER to invite an ADMIN', () => {
        expect(() => inviteAdmin(actingID)).toThrowError('As a user, you can only remove yourself from this organization');
    })

    it('should not allow a USER to invite an OWNER', () => {
        expect(() =>inviteOwner(actingID)).toThrowError('As a user, you can only remove yourself from this organization');
    })    
})