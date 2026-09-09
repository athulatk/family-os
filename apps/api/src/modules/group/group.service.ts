import type { GroupRespository } from "./group.repository";

export class GroupService {
    constructor(private readonly groupRepository: GroupRespository){}

    async list (userId: string) {
        return await this.groupRepository.findByUserId(userId);
    }

    async create(userId: string, groupName: string){
        return await this.groupRepository.createGroup(userId, groupName);
    }

}