// Script to check Supabase connection and verify Pipeline/Lane tables exist
// Run this with: node check-supabase-connection.js

const { createClient } = require('@supabase/supabase-js');

// Read environment variables from .env.local manually
const fs = require('fs');
const envContent = fs.readFileSync('.env.local', 'utf8');
const supabaseUrl = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/)?.[1]?.trim();
const supabaseKey = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.+)/)?.[1]?.trim();

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase environment variables not found!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTables() {
  console.log('🔍 Checking Supabase connection...');
  console.log('📡 URL:', supabaseUrl);
  
  try {
    // Check if Pipeline table exists
    const { data: pipelines, error: pipelineError } = await supabase
      .from('Pipeline')
      .select('*')
      .limit(1);
    
    console.log('\n📊 Pipeline table check:');
    if (pipelineError) {
      console.error('❌ Pipeline table error:', pipelineError);
    } else {
      console.log('✅ Pipeline table accessible');
      console.log('   Pipeline count:', pipelines?.length || 0);
    }
    
    // Check if Lane table exists
    const { data: lanes, error: laneError } = await supabase
      .from('Lane')
      .select('*')
      .limit(1);
    
    console.log('\n📊 Lane table check:');
    if (laneError) {
      console.error('❌ Lane table error:', laneError);
    } else {
      console.log('✅ Lane table accessible');
      console.log('   Lane count:', lanes?.length || 0);
    }
    
    // Try to get schema information
    console.log('\n🔍 Fetching all pipelines...');
    const { data: allPipelines, error: allError } = await supabase
      .from('Pipeline')
      .select('*');
    
    if (allError) {
      console.error('❌ Error fetching pipelines:', allError);
    } else {
      console.log('✅ Found', allPipelines?.length || 0, 'pipelines');
      if (allPipelines && allPipelines.length > 0) {
        console.log('   Latest pipeline:', allPipelines[0]);
      }
    }
    
  } catch (error) {
    console.error('❌ Connection error:', error);
  }
}

checkTables();

