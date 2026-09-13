import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { GroupRespository } from "./group.repository";
import { GroupService } from "./group.service";
import { GroupController } from "./group.controller";
import invitationRoutes from "./invitation/invitation.routes";

const router = Router();

const groupRepository = new GroupRespository();
const groupService = new GroupService(groupRepository);
const groupController = new GroupController(groupService);

router.get("/", authMiddleware, groupController.list);
router.post("/", authMiddleware, groupController.create);
router.use("/:groupId/invitations", authMiddleware, invitationRoutes);


export default router;