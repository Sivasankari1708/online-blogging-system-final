package com.blog.notificationservice.service;

import com.blog.notificationservice.dto.CreateNotificationRequest;
import com.blog.notificationservice.dto.NotificationResponse;

import java.util.List;

public interface NotificationService {

    NotificationResponse createNotification(CreateNotificationRequest request);

    List<NotificationResponse> getNotificationsByUser(String userId);

    List<NotificationResponse> getUnreadNotificationsByUser(String userId);

    NotificationResponse markAsRead(String notificationId);

    void markAllAsRead(String userId);
}