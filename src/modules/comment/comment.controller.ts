import { Router } from 'express';
import commentService from './comment.service.js';
import { isAuthenticate } from '../../middleware';
const router = Router({mergeParams:true})

router.post("{/:id}",isAuthenticate(),commentService.create)
router.get("/:id",commentService.getSpecific)
router.delete("/:id",isAuthenticate(),commentService.deleteComment)
router.post("/update/:id",isAuthenticate(),commentService.update)
router.post("/freeze/:id",isAuthenticate(),commentService.freeze)

export default router
