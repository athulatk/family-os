import { type Request, type Response } from "express";
import type { InvitationService } from "./invitation.service";
import type { InvitationCreateRequestBody } from "./invitation.types";

export class InvitationController {
  constructor(private readonly invitationService: InvitationService) {}

  create = async (req: Request, res: Response) => {
    const groupIdParam = req.params.groupId;

    const groupId = Array.isArray(groupIdParam) ? groupIdParam[0] : groupIdParam;

    if (!groupId) {
      throw new Error("Group id is required");
    }

    const { email = "" } = req.body as InvitationCreateRequestBody;

    const result = await this.invitationService.sendInvite(req.user!.id, groupId, email);

    return res.status(201).json({
      data: {
        id: result.invitation.id,
        email: result.invitation.email,
        expiresAt: result.invitation.expiresAt,
      },
    });
  };
}
