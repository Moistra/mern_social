import User from "../models/User";

// READ
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    const userFriends = await Promise.all(
      user.friends.map((id) => {
        User.findById(id);
      })
    );

    const formattedFriends = userFriends.map(
      ({ _id, firstName, lastName, picturePath, location, occupation }) => {
        return { _id, firstName, lastName, picturePath, location, occupation };
      }
    );
    res.status(200).json(formattedFriends);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//UPDATE
export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = User.findById(id);
    const friend = User.findById(friendId);

    if (user.friends.include(friendId)) {
      user.friends = user.friends.filter((id) => {
        id !== friendId;
      });
      friend.friends = friend.friend.filter((userId) => {
        userId !== id;
      });
    } else {
      user.friends.push(friendId);
      friend.friends.push(id);
    }

    await user.save();
    await friend.save();

    const userFriends = await Promise.all(
      user.friends.map((id) => {
        User.findById(id);
      })
    );

    const formattedFriends = userFriends.map(
      ({ _id, firstName, lastName, picturePath, location, occupation }) => {
        return { _id, firstName, lastName, picturePath, location, occupation };
      }
    );

    res.status(200).json(formattedFriends);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
