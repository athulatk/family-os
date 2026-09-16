import { Router } from "express";
import { authMiddleware } from "../../../middleware/auth.middleware";
import { InvitationController } from "./invitation.controller";
import { InvitationService } from "./invitation.service";
import { InvitationRepository } from "./invitation.repository";
import { EmailService } from "../../email/email.service";
import { GroupRespository } from "../group.repository";

const router = Router({
  mergeParams: true,
});

const invitationRepository = new InvitationRepository();

const emailService = new EmailService();

const groupRepository = new GroupRespository();

const invitationService = new InvitationService(
  invitationRepository,
  emailService,
  groupRepository,
);

const invitationController = new InvitationController(invitationService);

router.post("/", authMiddleware, invitationController.create);

export default router;
