import type { Request, Response } from "express";
import type { GroupService } from "./group.service";
import type { GroupCreateRequestBody } from "./group.types";

export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  list = async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const list = await this.groupService.list(userId);

    return res.status(200).json({
      data: {
        list,
      },
    });
  };

  create = async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { name = "" } = req.body as GroupCreateRequestBody;

    const group = await this.groupService.create(userId, name);

    return res.status(201).json({
      data: {
        group,
      },
    });
  };
}
