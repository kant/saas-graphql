import { membersPermissionFilter } from  './permissionModule';

export const generateState = () => ({
    name: 'INITIAL NAME',
    members: [{
        role: 'OWNER',
        user: {
            id: '0',
        },
    }, {
        role: 'OWNER',
        user: {
            id: '1',
        },
    },{
        role: 'ADMIN',
        user: {
            id: '2',
        },
    },{
        role: 'ADMIN',
        user: {
            id: '3',
        },
    },{
        role: 'USER',
        user: {
            id: '4',
        },
    },{
        role: 'USER',
        user: {
            id: '5',
        },
    }]
})

const passiveOwner = 1
const passiveAdmin = 3
const passiveUser = 5

const changeName = (actingID) => {
    const initialState = generateState()
    const newState = generateState();
    newState.name = 'NEW NAME'
    return membersPermissionFilter(initialState, newState, actingID)
}

const removeOwner = (actingID) => {
    const initialState = generateState()
    const newState = generateState();
    newState.members.splice(passiveOwner,1);
    return membersPermissionFilter(initialState, newState, actingID)
}

const removeAdmin = (actingID) => {
    const initialState = generateState()
    const newState = generateState();
    newState.members.splice(passiveAdmin,1);
    return membersPermissionFilter(initialState, newState, actingID)
}

const removeUser = (actingID) => {
    const initialState = generateState()
    const newState = generateState();
    newState.members.splice(passiveUser,1);
    return membersPermissionFilter(initialState, newState, actingID)
}

const upgradeUserToAdmin = (actingID) => {
    const initialState = generateState()
    const newState = generateState();
    newState.members[passiveUser].role === 'ADMIN'
    return membersPermissionFilter(initialState, newState, actingID)
}

const upgradeUserToOwner = (actingID) => {
    const initialState = generateState()
    const newState = generateState();
    newState.members[passiveUser].role === 'OWNER'
    return membersPermissionFilter(initialState, newState, actingID)
}

const downGradeAdminToUser = (actingID) => {
    const initialState = generateState()
    const newState = generateState();
    newState.members[passiveAdmin].role === 'USER'
    return membersPermissionFilter(initialState, newState, actingID)
}

const upgradeAdminToOwner = (actingID) => {
    const initialState = generateState()
    const newState = generateState();
    newState.members[passiveAdmin].role === 'OWNER'
    return membersPermissionFilter(initialState, newState, actingID)
}

const downGradeOwnerToUser = (actingID) => {
    const initialState = generateState()
    const newState = generateState();
    newState.members[passiveOwner].role === 'USER'
    return membersPermissionFilter(initialState, newState, actingID)
}

const downGradeOwnerToAdmin = (actingID) => {
    const initialState = generateState()
    const newState = generateState();
    newState.members[passiveOwner].role === 'ADMIN'
    return membersPermissionFilter(initialState, newState, actingID)
}

const removeSelf = (actingID) => {
    const initialState = generateState()
    const newState = generateState();
    newState.members.splice(actingID,1);
    return membersPermissionFilter(initialState, newState, actingID)
}

const setSelfAsUser = (actingID) => {
    const initialState = generateState()
    const newState = generateState();
    newState.members[actingID].role === 'USER'
    return membersPermissionFilter(initialState, newState, actingID)
}

const setSelfAsAdmin = (actingID) => {
    const initialState = generateState()
    const newState = generateState();
    newState.members[actingID].role === 'ADMIN'
    return membersPermissionFilter(initialState, newState, actingID)
}

const setSelfAsOwner = (actingID) => {
    const initialState = generateState()
    const newState = generateState();
    newState.members[actingID].role === 'OWNER'
    return membersPermissionFilter(initialState, newState, actingID)
}

const inviteUser = (actingID) => {
    const initialState = generateState()
    const newState = generateState();
    newState.members.push({
        role: 'USER',
        user: {
            id: 'new'
        }
    })
    return membersPermissionFilter(initialState, newState, actingID)
}

const inviteAdmin = (actingID) => {
    const initialState = generateState()
    const newState = generateState();
    newState.members.push({
        role: 'ADMIN',
        user: {
            id: 'new'
        }
    })
    return membersPermissionFilter(initialState, newState, actingID)
}

const inviteOwner = (actingID) => {
    const initialState = generateState()
    const newState = generateState();
    newState.members.push({
        role: 'ADMIN',
        user: {
            id: 'new'
        }
    })
    return membersPermissionFilter(initialState, newState, actingID)
}

describe('OWNER Permissions Tests', () => {
    const actingID = '0'
    it('should allow an OWNER to change name of the organization', () => {
        expect(changeName(actingID)).toBe(true)
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
    
    it('should allow an OWNER to leave the organization if no other owner', () => {
        const initialState = generateState()
        initialState.members.splice(0, 1)
        const newState = generateState();
        newState.members.splice(0,2);
        const result =  membersPermissionFilter(initialState, newState, actingID)
        expect(result).toBe(false);
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
        expect(changeName(actingID)).toBe(false)
    })

    it('should not allow a ADMIN to remove an OWNER', () => {
        expect(removeOwner(actingID)).toBe(false);
    })

    it('should not allow a ADMIN to remove an ADMIN', () => {
        expect(removeAdmin(actingID)).toBe(false);
    })

    it('should allow a ADMIN to remove an USER', () => {
        expect(removeUser(actingID)).toBe(true);
    })

    it('should allow a ADMIN to set an USER as an ADMIN', () => {
        expect(upgradeUserToAdmin(actingID)).toBe(true);
    })

    it('should not allow a ADMIN to set an USER as an OWNER', () => {
        expect(upgradeUserToOwner(actingID)).toBe(false);
    })

    it('should not allow a ADMIN to set an ADMIN as an USER', () => {
        expect(downGradeAdminToUser(actingID)).toBe(false);
    })

    it('should not allow a ADMIN to set an ADMIN as an OWNER', () => {
        expect(upgradeAdminToOwner(actingID)).toBe(false);
    })

    it('should not allow a ADMIN to set an OWNER as an USER', () => {
        expect(downGradeOwnerToUser(actingID)).toBe(false);
    })

    it('should not allow a ADMIN to set an OWNER as an ADMIN', () => {
        expect(downGradeOwnerToAdmin(actingID)).toBe(false);
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
        expect(setSelfAsOwner(actingID)).toBe(false);
    })

    it('should allow a ADMIN to invite a USER', () => {
        expect(inviteUser(actingID)).toBe(true);
    })

    it('should allow a ADMIN to invite an ADMIN', () => {
        expect(inviteAdmin(actingID)).toBe(true);
    })

    it('should not allow a ADMIN to invite an OWNER', () => {
        expect(inviteOwner(actingID)).toBe(false);
    })    
})

describe('USER Permissions Tests', () => {
    const actingID = '4'
    it('should not allow a USER to change name of the organization', () => {
        expect(changeName(actingID)).toBe(false)
    })

    it('should not allow a USER to remove an OWNER', () => {
        expect(removeOwner(actingID)).toBe(false);
    })

    it('should not allow a USER to remove an ADMIN', () => {
        expect(removeAdmin(actingID)).toBe(false);
    })

    it('should not allow a USER to remove an USER', () => {
        expect(removeUser(actingID)).toBe(false);
    })

    it('should not allow a USER to set an USER as an ADMIN', () => {
        expect(upgradeUserToAdmin(actingID)).toBe(false);
    })

    it('should not allow a USER to set an USER as an OWNER', () => {
        expect(upgradeUserToOwner(actingID)).toBe(false);
    })

    it('should not allow a USER to set an ADMIN as an USER', () => {
        expect(downGradeAdminToUser(actingID)).toBe(false);
    })

    it('should not allow a USER to set an ADMIN as an OWNER', () => {
        expect(upgradeAdminToOwner(actingID)).toBe(false);
    })

    it('should not allow a USER to set an OWNER as an USER', () => {
        expect(downGradeOwnerToUser(actingID)).toBe(false);
    })

    it('should not allow a USER to set an OWNER as an ADMIN', () => {
        expect(downGradeOwnerToAdmin(actingID)).toBe(false);
    })

    it('should allow a USER to leave the organization', () => {
        expect(removeSelf(actingID)).toBe(true);
    })

    it('should not allow a USER to set himself as ADMIN', () => {
        expect(setSelfAsAdmin(actingID)).toBe(false);
    })

    it('should not allow a USER to set himself as USER', () => {
        expect(setSelfAsUser(actingID)).toBe(false);
    })

    it('should not allow a USER to set himself as OWNER', () => {
        expect(setSelfAsOwner(actingID)).toBe(false);
    })

    it('should not allow a USER to invite a USER', () => {
        expect(inviteUser(actingID)).toBe(false);
    })

    it('should not allow a USER to invite an ADMIN', () => {
        expect(inviteAdmin(actingID)).toBe(false);
    })

    it('should not allow a USER to invite an OWNER', () => {
        expect(inviteOwner(actingID)).toBe(false);
    })    
})