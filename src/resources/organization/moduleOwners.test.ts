import { membersPermissionFilter } from  './permissionModule';


describe('OWNER Permissions Tests', () => {
    it('should not allow last OWNER to remove himself, if the last one', () => {
        const initialState = {
            members: [{
                role: 'OWNER',
                user: {
                    id: '123'
                },
            }]
        }

        const newState = {
            members: []
        }
        const result = membersPermissionFilter(initialState, newState, '123')
        expect(result).toBe(false)
    })

    it('should allow an OWNER to remove another OWNER', () => {
        const initialState = {
            members: [{
                role: 'OWNER',
                user: {
                    id: '123'
                },
            }, {
                role: 'OWNER',
                user: {
                    id: '456'
                }
            }]
        }

        const newState = {
            members: [{
                role: 'OWNER',
                user: {
                    id: '123'
                },
            }]
        }
        const result = membersPermissionFilter(initialState, newState, '123')
        expect(result).toBe(true);
    })

    it('should allow an OWNER to edit another OWNER', () => {
        const initialState = {
            members: [{
                role: 'OWNER',
                user: {
                    id: '123'
                },
            }, {
                role: 'OWNER',
                user: {
                    id: '456'
                }
            }]
        }

        const newState = {
            members: [{
                role: 'OWNER',
                user: {
                    id: '123'
                },
            },  {
                role: 'ADMIN',
                user: {
                    id: '456'
                }
            }]
        }
        const result = membersPermissionFilter(initialState, newState, '123')
        expect(result).toBe(true);
    })

    it('should allow an OWNER to remove an ADMIN', () => {
        const initialState = {
            members: [{
                role: 'OWNER',
                user: {
                    id: '123'
                },
            }, {
                role: 'ADMIN',
                user: {
                    id: '456'
                }
            }]
        }

        const newState = {
            members: [{
                role: 'OWNER',
                user: {
                    id: '123'
                },
            }]
        }
        const result = membersPermissionFilter(initialState, newState, '123')
        expect(result).toBe(true);
    })

    it('should allow an OWNER to edit an ADMIN', () => {
        const initialState = {
            members: [{
                role: 'OWNER',
                user: {
                    id: '123'
                },
            }, {
                role: 'ADMIN',
                user: {
                    id: '456'
                }
            }]
        }

        const newState = {
            members: [{
                role: 'OWNER',
                user: {
                    id: '123'
                },
            }, {
                role: 'USER',
                user: {
                    id: '456'
                }
            }]
        }
        const result = membersPermissionFilter(initialState, newState, '123')
        expect(result).toBe(true);
    })

    it('should allow an OWNER to remove a USER', () => {
        const initialState = {
            members: [{
                role: 'OWNER',
                user: {
                    id: '123'
                },
            }, {
                role: 'USER',
                user: {
                    id: '456'
                }
            }]
        }

        const newState = {
            members: [{
                role: 'OWNER',
                user: {
                    id: '123'
                },
            }]
        }
        const result = membersPermissionFilter(initialState, newState, '123')
        expect(result).toBe(true);
    })

    it('should allow an OWNER to edit a USER', () => {
        const initialState = {
            members: [{
                role: 'OWNER',
                user: {
                    id: '123'
                },
            }, {
                role: 'USER',
                user: {
                    id: '456'
                }
            }]
        }

        const newState = {
            members: [{
                role: 'OWNER',
                user: {
                    id: '123'
                },
            }, {
                role: 'ADMIN',
                user: {
                    id: '456'
                }
            }]
        }
        const result = membersPermissionFilter(initialState, newState, '123')
        expect(result).toBe(true);
    })

    it('should allow an OWNER to leave the organization, if not the last one', () => {
        const initialState = {
            members: [{
                role: 'OWNER',
                user: {
                    id: '123'
                },
            }, {
                role: 'OWNER',
                user: {
                    id: '456'
                }
            }]
        }

        const newState = {
            members: [{
                role: 'OWNER',
                user: {
                    id: '456'
                },
            }]
        }
        const result = membersPermissionFilter(initialState, newState, '123')
        expect(result).toBe(true);
    })

    it('should allow an OWNER to edit himself, if not the last one', () => {
        const initialState = {
            members: [{
                role: 'OWNER',
                user: {
                    id: '123'
                },
            }, {
                role: 'OWNER',
                user: {
                    id: '456'
                }
            }]
        }

        const newState = {
            members: [{
                role: 'OWNER',
                user: {
                    id: '123'
                },
            },  {
                role: 'ADMIN',
                user: {
                    id: '456'
                }
            }]
        }
        const result = membersPermissionFilter(initialState, newState, '456')
        expect(result).toBe(true);
    })
})

// CHECK FOR OWNERS TO INVITE USERS AND ADMINS
// CHECK FOR ADMINS TO INVITE USERS
// CHECK FOR USERS NOT ABLE TO INVITE ANYONE
// CHECK IF USERS DOES NOT HAVE A ROLE FOR THIS ORG
// CHECKS FOR EDITING THE NAME OF THE ORGANIZATION (ONLY OWNERS CAN)