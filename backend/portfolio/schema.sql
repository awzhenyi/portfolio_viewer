DROP TABLE IF EXISTS user_assets;
DROP TABLE IF EXISTS user_mediums;
DROP TABLE IF EXISTS asset_mediums;
DROP TABLE IF EXISTS users;

-- Users table
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Asset Mediums (Brokers/Crypto Exchanges or Wallets/Banks)
CREATE TABLE asset_mediums (
    medium_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('STOCK', 'CRYPTO', 'BANK')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(name, type)
);

-- User's asset medium accounts
CREATE TABLE user_mediums (
    user_medium_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    medium_id UUID REFERENCES asset_mediums(medium_id) ON DELETE CASCADE,
    value DECIMAL(19,4) NOT NULL DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, medium_id)
);

-- User's assets (stocks/crypto)
CREATE TABLE user_assets (
    asset_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_medium_id UUID REFERENCES user_mediums(user_medium_id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('STOCK', 'CRYPTO')),
    symbol VARCHAR(50) NOT NULL,
    quantity DECIMAL(19,8) NOT NULL DEFAULT 0,
    average_price DECIMAL(19,4) NOT NULL,
    total_value DECIMAL(19,4) NOT NULL DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_medium_id, symbol)
);

-- Indexes
CREATE INDEX idx_user_mediums_user_id ON user_mediums(user_id);
CREATE INDEX idx_user_assets_user_medium_id ON user_assets(user_medium_id);
CREATE INDEX idx_user_assets_symbol ON user_assets(symbol);
CREATE INDEX idx_users_email ON users(user_id);

-- Sample data
INSERT INTO asset_mediums (name, type) VALUES
    ('Tiger Brokers', 'STOCK'),
    ('Moomoo', 'STOCK'),
    ('WeBull', 'STOCK'),
    ('Interactive Brokers', 'STOCK'),
    ('Coinbase', 'CRYPTO'),
    ('OKX', 'CRYPTO'),
    ('Coinbase Wallet', 'CRYPTO'),
    ('DBS', 'BANK'),
    ('GXS', 'BANK'),
    ('MariBank', 'BANK'); 