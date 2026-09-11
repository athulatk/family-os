import type { InvitationRepository } from "./invitation.repository";
import { generateInvitationToken, hashInvitationToken } from "./invitation.utils";

export class InvitationService {
    constructor(private readonly invitationRepository: InvitationRepository){}
    async sendInvite (createdById: string, groupId: string, email: string) {
        const normalizedEmail = email.trim().toLowerCase();
    
        const token = generateInvitationToken();
        const tokenHash = hashInvitationToken(token);

        const expiresAt = new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000,
        );

        const invitation =
            await this.invitationRepository.create({
                createdById,
                groupId,
                email: normalizedEmail,
                tokenHash,
                expiresAt,
        });
        return invitation;
    }
}