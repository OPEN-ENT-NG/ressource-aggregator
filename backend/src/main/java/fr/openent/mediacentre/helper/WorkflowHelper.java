package fr.openent.mediacentre.helper;

import org.entcore.common.user.UserInfos;

import java.util.List;

public class WorkflowHelper {

    private WorkflowHelper() {
    }

    public static boolean hasRight(UserInfos user, String action) {
        List<UserInfos.Action> actions = user.getAuthorizedActions();
        for (UserInfos.Action userAction : actions) {
            if (action.equals(userAction.getDisplayName())) {
                return true;
            }
        }
        return false;
    }
}

