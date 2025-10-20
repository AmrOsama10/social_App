import { Request, Response } from "express";
import { UserRepository } from "./../../DB/user/user.repository";
import {
  BadRequestException,
  NotFoundException,
  STATUS,
} from "../../utils/index.js";

class UserService {
  private userRepository = new UserRepository();
  constructor() {}
  getSpecificProfile = async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await this.userRepository.getOne(
      { _id: id },
      {},
      {
        populate: [
          {
            path: "posts",
            match: { status: STATUS.active },
          },
          {
            path: "comments",
            match: { status: STATUS.active },
          },
        ],
      }
    );
    if (
      !user ||
      user.userBlock.includes(req.user._id) ||
      req.user.userBlock.includes(user._id)
    ) {
      throw new NotFoundException("user not found");
    }
    return res
      .status(200)
      .json({ message: "done", success: true, data: { user } });
  };

  getProfile = async (req: Request, res: Response) => {
    return res
      .status(200)
      .json({ message: "done", success: true, data: { user: req.user } });
  };

  friendRequest = async (req: Request, res: Response) => {
    const { receiverId } = req.params;
    const senderId = req.user._id;
    const receiver = await this.userRepository.getOne({ _id: receiverId });
    if (!receiver) {
      throw new NotFoundException("receiver not found");
    }
    if (senderId.toString() == receiverId)
      throw new BadRequestException("you cannot send a request to yourself");

    if (receiver.friends.includes(senderId))
      throw new BadRequestException("already friends");

    if (receiver.friendRequests.includes(senderId))
      throw new BadRequestException("request already sent");

    await this.userRepository.update(
      { _id: receiverId },
      {
        $addToSet: { friendRequests: senderId },
      }
    );
    return res
      .status(201)
      .json({ message: "friend request sent", success: true });
  };

  acceptFriendRequest = async (req: Request, res: Response) => {
    const { senderId } = req.params;
    const receiverId = req.user._id;
    await this.userRepository.update(
      { _id: receiverId },
      {
        $pull: { friendRequests: senderId },
        $addToSet: { friends: senderId },
      }
    );
    await this.userRepository.update(
      { _id: senderId },
      {
        $addToSet: { friends: receiverId },
      }
    );
    return res
      .status(200)
      .json({ message: "friend request accepted", success: true });
  };

  deleteFriendRequest = async (req: Request, res: Response) => {
    const { senderId } = req.params;
    const receiverId = req.user._id;
    await this.userRepository.update(
      { _id: receiverId },
      {
        $pull: { friendRequests: senderId },
      }
    );
    return res
      .status(200)
      .json({ message: "friend request deleted", success: true });
  };

  unFriend = async (req: Request, res: Response) => {
    const { friendId } = req.params;
    const receiverId = req.user._id;

    await this.userRepository.update(
      { _id: receiverId },
      {
        $pull: { friends: friendId },
      }
    );

    await this.userRepository.update(
      { _id: friendId },
      {
        $pull: { friends: receiverId },
      }
    );
    return res.status(200).json({ message: "friend deleted", success: true });
  };

  blockUser = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const userBlocked = await this.userRepository.exist({ _id: userId });
    if (!userBlocked) throw new NotFoundException("user not found");
    await this.userRepository.update(
      { _id: req.user._id },
      {
        $addToSet: { userBlock: userId },
        $pull: {
          friendRequests: userId,
          friends: userId,
        },
      }
    );
    return res.status(200).json({ message: "user blocked", success: true });
  };
}

export default new UserService();
