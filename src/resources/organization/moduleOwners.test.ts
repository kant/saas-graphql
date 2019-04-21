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

describe('OWNER Permissions Tests', () => {
    it('should allow an OWNER to change name of the organization', () => {
        const initialState = generateState()
        const newState = generateState();
        newState.name = 'NEW NAME'
        const result = membersPermissionFilter(initialState, newState, '0')
        expect(result).toBe(true)
    })
    it('should not allow last OWNER to remove himself, if the last one', () => {
        const initialState = generateState()
            initialState.members.splice(0,1)
        const newState = generateState();
            newState.members.splice(0,2)
        const result = membersPermissionFilter(initialState, newState, '1')
        expect(result).toBe(false)
    })

    it('should allow an OWNER to remove another OWNER', () => {
        const initialState = generateState()
        const newState = generateState();
            newState.members.splice(0,1);
        const result = membersPermissionFilter(initialState, newState, '1')
        expect(result).toBe(true);
    })

    it('should allow an OWNER to edit another OWNER', () => {
        const initialState = generateState()
        const newState = generateState();
            newState.members[0].role === 'ADMIN'
        const result = membersPermissionFilter(initialState, newState, '1')
        expect(result).toBe(true);
    })

    it('should allow an OWNER to remove an ADMIN', () => {
        const initialState = generateState()
        const newState = generateState();
            newState.members.splice(2,1);
        const result = membersPermissionFilter(initialState, newState, '0')
        expect(result).toBe(true);
    })

    it('should allow an OWNER to edit an ADMIN', () => {
        const initialState = generateState()
        const newState = generateState();
            newState.members[2].role === "USER"
        const result = membersPermissionFilter(initialState, newState, '0')
        expect(result).toBe(true);
    })

    it('should allow an OWNER to remove a USER', () => {
        const initialState = generateState()
        const newState = generateState();
            newState.members.splice(4,1);
        const result = membersPermissionFilter(initialState, newState, '0')
        expect(result).toBe(true);
    })

    it('should allow an OWNER to edit a USER', () => {
        const initialState = generateState()
        const newState = generateState();
            newState.members[4].role === "ADMIN"
        const result = membersPermissionFilter(initialState, newState, '0')
        expect(result).toBe(true);
    })

    it('should allow an OWNER to leave the organization, if not the last one', () => {
        const initialState = generateState()
        const newState = generateState();
            newState.members.splice(0,1)
        const result = membersPermissionFilter(initialState, newState, '0')
        expect(result).toBe(true);
    })

    it('should allow an OWNER to edit himself, if not the last one', () => {
        const initialState = generateState()
        const newState = generateState();
            newState.members[0].role === "ADMIN"
        const result = membersPermissionFilter(initialState, newState, '0')
        expect(result).toBe(true);
    })

    it('should allow an OWNER invite a USER', () => {
        const initialState = generateState()
        const newState = generateState();
            newState.members.push({
                role: 'USER',
                user: {
                    id: 'new'
                }
            })
        const result = membersPermissionFilter(initialState, newState, '0')
        expect(result).toBe(true);
    })

    it('should allow an OWNER invite an ADMIN', () => {
        const initialState = generateState()
        const newState = generateState();
            newState.members.push({
                role: 'ADMIN',
                user: {
                    id: 'new'
                }
            })
        const result = membersPermissionFilter(initialState, newState, '0')
        expect(result).toBe(true);
    })

    it('should allow an OWNER invite an OWNER', () => {
        const initialState = generateState()
        const newState = generateState();
            newState.members.push({
                role: 'OWNER',
                user: {
                    id: 'new'
                }
            })
        const result = membersPermissionFilter(initialState, newState, '0')
        expect(result).toBe(true);
    })
})

describe('USER Permissions Tests', () => {
    it('should not allow a USER to change name of the organization', () => {
        const initialState = generateState()
        const newState = generateState();
        newState.name = 'NEW NAME'
        const result = membersPermissionFilter(initialState, newState, '5')
        expect(result).toBe(false)
    })
    it('should not allow a USER to remove a OWNER', () => {
        const initialState = generateState()
        const newState = generateState();
            newState.members.splice(0,1)
        const result = membersPermissionFilter(initialState, newState, '5')
        expect(result).toBe(false)
    })

    it('should not allow a USER to edit a OWNER', () => {
        const initialState = generateState()
        const newState = generateState();
            newState.members[0].role === 'ADMIN'
        const result = membersPermissionFilter(initialState, newState, '5')
        expect(result).toBe(false);
    })

    it('should not allow a USER to remove an ADMIN', () => {
        const initialState = generateState()
            initialState.members.splice(0,1)
        const newState = generateState();
            newState.members.splice(2,1)
        const result = membersPermissionFilter(initialState, newState, '5')
        expect(result).toBe(false);
    })

    it('should not allow an USER to edit an ADMIN', () => {
        const initialState = generateState()
        const newState = generateState();
            newState.members[2].role === 'USER'
        const result = membersPermissionFilter(initialState, newState, '5')
        expect(result).toBe(false);
    })

    it('should not allow a USER to remove a USER', () => {
        const initialState = generateState()
            initialState.members.splice(0,1)
        const newState = generateState();
            newState.members.splice(4,1)
        const result = membersPermissionFilter(initialState, newState, '5')
        expect(result).toBe(false);
    })

    it('should not allow a USER to edit a USER', () => {
        const initialState = generateState()
        const newState = generateState();
            newState.members[4].role === 'ADMIN'
        const result = membersPermissionFilter(initialState, newState, '5')
        expect(result).toBe(false);
    })

    it('should allow a USER to leave the organization', () => {
        const initialState = generateState()
        const newState = generateState();
            newState.members.splice(5,1)
        const result = membersPermissionFilter(initialState, newState, '5')
        expect(result).toBe(true);
    })

    it('should not allow a USER invite an OWNER', () => {
        const initialState = generateState()
        const newState = generateState();
        newState.members.push({
            role: 'OWNER',
            user: {
                id: 'new'
            }
        })
        const result = membersPermissionFilter(initialState, newState, '5')
        expect(result).toBe(false);
    })

    it('should not allow a USER invite an ADMIN', () => {
        const initialState = generateState()
        const newState = generateState();
        newState.members.push({
            role: 'ADMIN',
            user: {
                id: 'new'
            }
        })
        const result = membersPermissionFilter(initialState, newState, '5')
        expect(result).toBe(false);
    })

    it('should not allow a USER invite a USER', () => {
        const initialState = generateState()
        const newState = generateState();
        newState.members.push({
            role: 'USER',
            user: {
                id: 'new'
            }
        })
        const result = membersPermissionFilter(initialState, newState, '5')
        expect(result).toBe(false);
    })

    it('should not allow an USER to edit himself', () => {
        const initialState = generateState()
        const newState = generateState();
            newState.members[5].role === "ADMIN"
        const result = membersPermissionFilter(initialState, newState, '5')
        expect(result).toBe(false);
    })
})