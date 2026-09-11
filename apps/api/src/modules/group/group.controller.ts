import type { Request, Response } from "express";
import type { GroupService } from "./group.service";

export class GroupController {
    constructor(private readonly groupService: GroupService){}

    list = async (req: Request, res: Response) => {
        const userId = req?.user!.id;
        const list = await this.groupService.list(userId);

        return res.status(200).json({
            data: {
                list
            }
        })
    }

    create = async (req: Request, res: Response) => {
        const userId = req?.user!.id;
        const groupName = req.body.name;

        const group = await this.groupService.create(userId, groupName);

        return res.status(201).json({
            data: {
                group
            }
        })
    }
}