#!/usr/bin/env bash

set -euo pipefail

echo "Configuring SQS"
echo "==================="
LOCALSTACK_HOST=localhost
AWS_REGION=us-east-1

create_queue() {
  local QUEUE_NAME_TO_CREATE=$1
  awslocal --endpoint-url=http://${LOCALSTACK_HOST}:4566 sqs create-queue --queue-name ${QUEUE_NAME_TO_CREATE} --region ${AWS_REGION} --attributes VisibilityTimeout=60
}

create_queue "email-notification-local"
create_queue "email-notification-test"

create_queue "sms-notification-local"
create_queue "sms-notification-test"
