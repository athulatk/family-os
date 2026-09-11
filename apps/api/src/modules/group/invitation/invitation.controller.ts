import type { Request, Response } from "express";
import type { InvitationService } from "./invitation.service";
import type { InvitationCreateInput } from "./invitation.types";


export class InvitationController {
    constructor(private readonly invitationService: InvitationService){}
    sendInvite = async (req: Request<InvitationCreateInput>, res: Response) => {
        const createdById = req?.user?.id || '';
        const { groupId } = req.params;
        const { email } = req.body;
        const result = await this.invitationService.sendInvite(createdById, groupId, email);
        return res.status(200).json({
            data: {
                id: result.id,
                email: result.email,
                expiresAt: result.expiresAt,
            }
        })
    }
}